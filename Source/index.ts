/**********************************************************************
aka: A very simple URL shorting service
Copyright (C) 2024  langningchen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
**********************************************************************/

import template from './index.html';

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		if (request.method == "POST") {
			const RequestData: string = await request.text();
			try {
				var { Key: KeyData, URL: URLData } = JSON.parse(RequestData);
				new URL(URLData);
			} catch {
				return new Response("Invalid request");
			}
			await env.aka.put(KeyData, URLData);
			return new Response("Success");
		}
		if (request.method == "GET") {
			const IDString: string = new URL(request.url).pathname.substring(1);
			if (IDString == "") {
				return new Response(template, {
					headers: {
						"Content-Type": "text/html",
					},
				});
			}
			const URLData = await env.aka.get(IDString);
			if (URLData == undefined) { return new Response("Not found"); }
			return new Response("Redirecting you to \"" + URLData + "\". If it does not redirect automatically, enter the address manually.", {
				headers: {
					location: URLData,
				},
				status: 301,
			});
		}
		return new Response("404");
	},
};
