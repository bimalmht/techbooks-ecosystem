export default {
  async fetch(request, env, ctx) {
    // 1. Handle preflight CORS requests from browsers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allows your frontend to talk to the backend securely
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 2. Your existing GET route for services
    if (url.pathname === "/api/services" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM services ORDER BY sort_order ASC"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    // Inside your fetch() block in the worker file, add this handler:
    if (url.pathname === "/api/announcements" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }
    // Add this route handler block alongside your existing endpoints:
    if (url.pathname === "/api/leads" && request.method === "POST") {
      try {
        const body = await request.json();
        const { name, email, scope, specs } = body;

        // Strict validation check inside the cloud cluster
        if (!name || !email || !scope || !specs) {
          return new Response(JSON.stringify({ error: "Missing required specifications fields." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        // Insert payload directly into D1 customer_leads table
        await env.DB.prepare(
          "INSERT INTO customer_leads (client_name, client_email, engine_scope, project_specs) VALUES (?, ?, ?, ?)"
        ).bind(name, email, scope, specs).run();

        return new Response(JSON.stringify({ success: true, message: "Lead generated successfully." }), {
          status: 201,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    // Fallback route
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};