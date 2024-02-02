// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    if (new Request(request).headers.has("x-auth")) {
      return new Response(`Hello`, {
        headers: {
          "content-type": "text/html"
        }
      });
    }
    return new Response(JSON.stringify(new Request(request).headers.has("x-auth")), {
      status: 401
    });
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
