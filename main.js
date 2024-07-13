
const m_canv = document.getElementById("m_canv");
const m_ctx = m_canv.getContext("2d");
const width = 1000;
const height = 600;
m_canv.width = width;
m_canv.height = height;

const welt_ctx = new WeltContext();

welt_ctx.add_vertex(10, 0, 0);
welt_ctx.add_vertex(-10, 0, 0);
welt_ctx.add_vertex(0, 10, 0);
welt_ctx.add_vertex(0, -10, 0);

welt_ctx.render(0, 0, width, height, m_ctx);