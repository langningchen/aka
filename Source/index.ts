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

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		if (request.method == "POST") {
			if (await env.aka.get("Size") === null) {
				await env.aka.put("Size", 0);
			}
			const URLData: string = await request.text();
			const ID: Number = Number(await env.aka.get("Size")) + 1;
			await env.aka.put(ID, URLData);
			await env.aka.put("Size", ID);
			return new Response(ID.toString(36));
		}
		if (request.method == "GET") {
			const IDString: string = new URL(request.url).pathname.substring(1);
			if (IDString == "") {
				return new Response(`<input type="url"><button>submit</button><pre></pre><script>
const InputElement = document.getElementsByTagName("input")[0];
const ButtonElement = document.getElementsByTagName("button")[0];
const PreElement = document.getElementsByTagName("pre")[0];
PreElement.innerText += "This is a URL shorting service. Just submit the URL above and you will get the shortened URL in a few seconds! \\n\\n";
ButtonElement.addEventListener("click", async () => {
    PreElement.innerText += "Uploading URL\\n";
	const ID = await fetch("/", {
		body: InputElement.value,
		method: "POST",
	}).then(r => r.text());
	let Path = new URL(window.location); 
	Path.pathname = "/" + ID;
	PreElement.innerText += "Shortened URL: " + Path.toString() + "\\n\\n";
});</script>`, {
					headers: {
						"Content-Type": "text/html",
					},
				});
			}
			const ID = parseInt(IDString, 36);
			if (isNaN(ID)) { return new Response("Invalid data"); }
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
