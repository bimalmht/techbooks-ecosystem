export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Route: /api/services
    if (url.pathname === "/api/services") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM services").all();
        return new Response(JSON.stringify(results), {
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Route: /api/announcements/active
    if (url.pathname === "/api/announcements/active") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM announcements WHERE is_active = 1").all();
        return new Response(JSON.stringify(results), {
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // Default 404
    return new Response(JSON.stringify({ message: "Techbooks Backend API Route Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
};