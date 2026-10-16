// API simulada (solo para pruebas locales SIN Laravel). Misma forma que ecommerce-api-swagger.
// Uso: npm run mock   → http://localhost:8000/api
import http from "node:http";

const products = [
  { id: 1, name: "Camiseta", description: "Camiseta de algodón", price: "19.99", stock: 50 },
  { id: 2, name: "Gorra", description: "Gorra ajustable", price: "12.50", stock: 30 },
  { id: 3, name: "Mochila", description: "Mochila resistente al agua", price: "45.00", stock: 10 },
];
const users = []; const tokens = new Map(); const orders = []; let oid = 1, uid = 1, iid = 1, pid = 1;

const send = (res, code, data) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(data === undefined ? "" : JSON.stringify(data)); };
const body = (req) => new Promise((r) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { try { r(JSON.parse(b || "{}")); } catch { r({}); } }); });

const DELAY = Number(process.env.MOCK_DELAY || 0); // ms, para simular una API lenta
http.createServer(async (req, res) => {
  if (DELAY) await new Promise((r) => setTimeout(r, DELAY));
  const url = new URL(req.url, "http://x"); const p = url.pathname.replace(/^\/api/, ""); const m = req.method;
  const tok = (req.headers.authorization || "").replace("Bearer ", ""); const user = tokens.get(tok);
  const needAuth = () => { if (!user) { send(res, 401, { message: "Unauthenticated." }); return true; } };

  if (m === "POST" && p === "/auth/register") {
    const d = await body(req); const errors = {};
    if (!d.name) errors.name = ["El nombre es obligatorio."];
    if (!d.email) errors.email = ["El correo es obligatorio."];
    else if (users.find((u) => u.email === d.email)) errors.email = ["El correo ya está registrado."];
    if (!d.password || d.password.length < 8) errors.password = ["La contraseña debe tener al menos 8 caracteres."];
    else if (d.password !== d.password_confirmation) errors.password = ["La confirmación no coincide."];
    if (Object.keys(errors).length) return send(res, 422, { message: "Error de validación", errors });
    const u = { id: uid++, name: d.name, email: d.email, password: d.password, orders: [] }; users.push(u);
    const t = "jwt." + Math.random().toString(36).slice(2); tokens.set(t, u);
    return send(res, 201, { user: { id: u.id, name: u.name, email: u.email }, access_token: t, token_type: "bearer" });
  }
  if (m === "POST" && p === "/auth/login") {
    const d = await body(req); const u = users.find((x) => x.email === d.email && x.password === d.password);
    if (!u) return send(res, 401, { message: "Credenciales incorrectas." });
    const t = "jwt." + Math.random().toString(36).slice(2); tokens.set(t, u);
    return send(res, 200, { access_token: t, token_type: "bearer" });
  }
  if (m === "GET" && p === "/products") return send(res, 200, products);
  const pm = p.match(/^\/products\/(\d+)$/);
  if (m === "GET" && pm) { const x = products.find((q) => q.id == pm[1]); return x ? send(res, 200, x) : send(res, 404, { message: "No query results for model [App\\Models\\Product]" }); }
  if (m === "POST" && p === "/auth/logout") { if (needAuth()) return; tokens.delete(tok); return send(res, 200, { message: "Sesión cerrada correctamente." }); }
  if (m === "GET" && p === "/auth/me") { if (needAuth()) return; return send(res, 200, { id: user.id, name: user.name, email: user.email }); }
  if (m === "GET" && p === "/orders") { if (needAuth()) return; return send(res, 200, orders.filter((o) => o.user_id === user.id).slice().reverse()); }
  if (m === "POST" && p === "/orders") {
    if (needAuth()) return; const d = await body(req);
    if (!Array.isArray(d.items) || !d.items.length) return send(res, 422, { message: "The items field is required.", errors: { items: ["The items field is required."] } });
    const items = d.items.map((i) => { const pr = products.find((q) => q.id == i.product_id); return { id: iid++, product_id: i.product_id, quantity: i.quantity, price: pr.price, product: pr }; });
    const total = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0).toFixed(2);
    const o = { id: oid++, user_id: user.id, total, status: "pending", created_at: new Date().toISOString(), items, payment: null }; orders.push(o);
    return send(res, 201, o);
  }
  const om = p.match(/^\/orders\/(\d+)(\/pay)?$/);
  if (om) {
    if (needAuth()) return; const o = orders.find((x) => x.id == om[1]);
    if (!o) return send(res, 404, { message: "No query results for model [App\\Models\\Order]" });
    if (o.user_id !== user.id) return send(res, 403, { message: "No autorizado." });
    if (m === "GET" && !om[2]) return send(res, 200, o);
    if (m === "POST" && om[2]) {
      if (o.status === "paid") return send(res, 422, { message: "Esta orden ya fue pagada." });
      o.status = "paid"; o.payment = { id: pid++, order_id: o.id, stripe_payment_id: "pi_mock_" + o.id, amount: o.total, status: "succeeded" };
      return send(res, 200, { order: o, payment: o.payment });
    }
  }
  send(res, 404, { message: "Not found" });
}).listen(8000, () => console.log("Mock API en http://localhost:8000/api"));
