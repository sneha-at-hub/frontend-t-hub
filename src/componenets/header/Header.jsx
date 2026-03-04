import { useState, useRef, useEffect } from "react";
import {
  Search, ShoppingCart, Heart, ArrowRight, Building2, Menu, X,
  ChevronDown, ChevronRight, ChevronLeft, Grid3x3, Home,
  Package, Users, Globe, Shield, Star, MoreHorizontal,
  Zap, PhoneCall, UserCircle2, UserPlus, LogIn, BadgeCheck, Truck
} from "lucide-react";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

const categories = [
  {
    name: "Electronics", count: "2,400+",
    sub: [
      { name: "Computers & Laptops", items: ["Gaming Laptops", "Ultrabooks", "Workstations", "Chromebooks"] },
      { name: "Mobile & Tablets",    items: ["Smartphones", "Tablets", "Smartwatches", "Accessories"] },
      { name: "Audio & Visual",      items: ["Headphones", "Speakers", "LED Displays", "Webcams"] },
    ],
    promo: { title: "New Arrivals", sub: "Latest tech just dropped", cta: "Shop Now" },
  },
  {
    name: "Apparel", count: "5,100+",
    sub: [
      { name: "Men's Fashion",   items: ["Formal Wear", "Casual Wear", "Sportswear", "Outerwear"] },
      { name: "Women's Fashion", items: ["Dresses", "Tops & Blouses", "Activewear", "Accessories"] },
      { name: "Kids & Baby",     items: ["Boys Clothing", "Girls Clothing", "Infant Wear", "Footwear"] },
    ],
    promo: { title: "Season Sale", sub: "Up to 60% off fashion", cta: "View Deals" },
  },
  {
    name: "Home & Living", count: "3,800+",
    sub: [
      { name: "Furniture",        items: ["Sofas", "Beds", "Office Desks", "Shelving"] },
      { name: "Kitchen & Dining", items: ["Cookware", "Dinnerware", "Appliances", "Storage"] },
      { name: "Decor & Lighting", items: ["Wall Art", "Lamps", "Rugs", "Curtains"] },
    ],
    promo: { title: "Home Refresh", sub: "Upgrade your living space", cta: "Explore" },
  },
  {
    name: "Industrial", count: "1,900+",
    sub: [
      { name: "Tools & Machinery", items: ["Power Tools", "Hand Tools", "Heavy Machinery", "Safety Gear"] },
      { name: "Raw Materials",     items: ["Steel & Metals", "Plastics", "Chemicals", "Textiles"] },
      { name: "Packaging",         items: ["Boxes & Cartons", "Bags & Pouches", "Labels", "Stretch Film"] },
    ],
    promo: { title: "Bulk Orders", sub: "Save more, order more", cta: "Get Quotes" },
  },
  {
    name: "Food & Bev", count: "2,200+",
    sub: [
      { name: "Fresh Produce",  items: ["Fruits", "Vegetables", "Herbs & Spices", "Organic"] },
      { name: "Packaged Foods", items: ["Snacks", "Grains", "Canned Goods", "Condiments"] },
      { name: "Beverages",      items: ["Water & Juices", "Tea & Coffee", "Energy Drinks", "Dairy"] },
    ],
    promo: { title: "Organic Range", sub: "Fresh, natural, certified", cta: "Browse" },
  },
  {
    name: "Beauty", count: "1,600+",
    sub: [
      { name: "Skincare",  items: ["Moisturizers", "Serums", "Sunscreen", "Face Masks"] },
      { name: "Makeup",    items: ["Foundation", "Lipsticks", "Eye Makeup", "Brushes"] },
      { name: "Haircare",  items: ["Shampoos", "Conditioners", "Styling", "Hair Color"] },
    ],
    promo: { title: "Beauty Box", sub: "Curated sets for every skin", cta: "Shop Sets" },
  },
];

const VISIBLE_CATS = 3;

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose }) {
  const [screen, setScreen] = useState("home");
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => { if (!open) { setScreen("home"); setActiveCat(null); } }, [open]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "min(320px,88vw)", background: "#fff", zIndex: 301, display: "flex", flexDirection: "column", boxShadow: "8px 0 40px rgba(0,0,0,0.2)", overflowY: "auto", animation: "drawerIn 0.25s ease" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#111827,#030712)", padding: "20px 16px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "#dc2626", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={16} color="#fff" /></div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>TradeHub</div>
                <div style={{ color: "#ef4444", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Wholesale</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="#fff" /></button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, height: 40, background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}><LogIn size={13} /> Sign In</button>
            <button style={{ flex: 1, height: 40, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}><UserPlus size={13} /> Register</button>
          </div>
        </div>

        {/* Home screen */}
        {screen === "home" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ padding: "12px 16px 4px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, }}>Quick Links</p>
              {[{ Icon: Home, label: "Home" }, { Icon: Users, label: "Suppliers" }, { Icon: Star, label: "Top Rated" }, { Icon: Package, label: "Bulk Orders" }].map(({ Icon, label }) => (
                <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: "#374151", fontWeight: 500, fontFamily: "inherit", marginBottom: 2 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={15} color="#6b7280" /></div>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ height: 1, background: "#f3f4f6", margin: "8px 16px" }} />
            <div style={{ padding: "4px 16px 16px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>All Categories</p>
              {categories.map(cat => (
                <button key={cat.name} onClick={() => { setActiveCat(cat); setScreen("cat"); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", marginBottom: 2 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{cat.count} products</div>
                  </div>
                  <ChevronRight size={14} color="#d1d5db" />
                </button>
              ))}
            </div>
            <div style={{ margin: "0 16px 20px", borderRadius: 12, background: "#f9fafb", border: "1px solid #f3f4f6", padding: "10px 14px" }}>
              {[{ Icon: BadgeCheck, label: "Verified Suppliers", color: "#10b981" }, { Icon: Truck, label: "Worldwide Shipping", color: "#0ea5e9" }, { Icon: Zap, label: "Bulk Discounts", color: "#f59e0b" }].map(({ Icon, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: "#4b5563" }}>
                  <Icon size={13} color={color} /> {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category screen */}
        {screen === "cat" && activeCat && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <button onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280", fontFamily: "inherit", borderBottom: "1px solid #f3f4f6", width: "100%" }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div style={{ padding: "14px 16px 4px", display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>{activeCat.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{activeCat.count} products</div>
              </div>
            </div>
            <div style={{ padding: "8px 16px 20px" }}>
              {activeCat.sub.map(sub => (
                <div key={sub.name} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 4px 6px" }}>{sub.name}</div>
                  {sub.items.map(item => (
                    <button key={item} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", fontSize: 13, color: "#4b5563", cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; }}
                    >
                      · {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Search Category Dropdown ─────────────────────────────────────────────────
function SearchCatDropdown({ onSelect, selected }) {
  const [open, setOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRight: "none", borderRadius: "16px 0 0 16px", fontSize: 13, fontWeight: 600, color: "#4b5563", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
        <Grid3x3 size={14} color="#9ca3af" />
        <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>{selected}</span>
        <ChevronDown size={12} color="#9ca3af" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", zIndex: 500, display: "flex", overflow: "hidden", minWidth: 500, boxShadow: "0 24px 64px rgba(0,0,0,0.13)" }}>
          <div style={{ width: 176, background: "#f9fafb", borderRight: "1px solid #f3f4f6", padding: "8px 0" }}>
            <p style={{ padding: "8px 16px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Categories</p>
            <button onMouseEnter={() => setHoveredCat(null)} onClick={() => { onSelect("All Categories"); setOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, textAlign: "left", cursor: "pointer", background: !hoveredCat ? "#fff" : "transparent", color: !hoveredCat ? "#dc2626" : "#4b5563", fontWeight: !hoveredCat ? 600 : 400, border: "none", borderRight: !hoveredCat ? "2px solid #ef4444" : "2px solid transparent", fontFamily: "inherit" }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}><Grid3x3 size={11} color="#6b7280" /></div>
              All Categories
            </button>
            {categories.map(cat => (
              <button key={cat.name} onMouseEnter={() => setHoveredCat(cat)} onClick={() => { onSelect(cat.name); setOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 13, textAlign: "left", cursor: "pointer", background: hoveredCat?.name === cat.name ? "#fff" : "transparent", color: hoveredCat?.name === cat.name ? "#dc2626" : "#4b5563", fontWeight: hoveredCat?.name === cat.name ? 600 : 400, border: "none", borderRight: hoveredCat?.name === cat.name ? "2px solid #ef4444" : "2px solid transparent", fontFamily: "inherit" }}>
                {cat.name}
              </button>
            ))}
          </div>
          {hoveredCat ? (
            <div style={{ width: 176, borderRight: "1px solid #f3f4f6", padding: "8px 0" }}>
              <p style={{ padding: "8px 16px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>{hoveredCat.name}</p>
              {hoveredCat.sub.map(sub => (
                <button key={sub.name} onClick={() => { onSelect(sub.name); setOpen(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", fontSize: 13, color: "#374151", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
                >{sub.name} <ChevronRight size={12} color="#d1d5db" /></button>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, padding: "16px 20px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Popular Categories</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {categories.map(cat => (
                  <button key={cat.name} onClick={() => { onSelect(cat.name); setOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, fontSize: 13, color: "#374151", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
                  >{cat.name}</button>
                ))}
              </div>
            </div>
          )}
          {hoveredCat && (
            <div style={{ flex: 1, padding: "8px 0" }}>
              <p style={{ padding: "8px 16px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Items</p>
              {hoveredCat.sub.map(sub => sub.items.map(item => (
                <button key={item} onClick={() => { onSelect(item); setOpen(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 13, color: "#4b5563", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; }}
                ><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", flexShrink: 0, display: "inline-block" }} />{item}</button>
              )))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Auth Dropdown ────────────────────────────────────────────────────────────
function AuthDropdown() {
  return (
    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", width: 320, zIndex: 500, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
      <div style={{ background: "linear-gradient(135deg,#030712,#111827)", padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -32, right: -32, width: 128, height: 128, borderRadius: "50%", background: "rgba(220,38,38,0.15)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 44, height: 44, background: "#dc2626", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Building2 size={18} color="#fff" /></div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>TradeHub Wholesale</p>
            <p style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Your global trade partner</p>
          </div>
        </div>
        <p style={{ position: "relative", zIndex: 1, color: "#9ca3af", fontSize: 12, lineHeight: 1.6, marginTop: 16 }}>Access 2M+ verified suppliers, track orders, and manage your wholesale business — all in one place.</p>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 48, background: "#dc2626", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = "#b91c1c"}
          onMouseLeave={e => e.currentTarget.style.background = "#dc2626"}
        ><LogIn size={15} /> Sign In to Your Account</button>
        <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 48, background: "#f9fafb", color: "#1f2937", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "1px solid #e5e7eb", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
          onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
        ><UserPlus size={15} color="#6b7280" /> Create Free Account</button>
      </div>
      <div style={{ margin: "0 16px 16px", borderRadius: 12, overflow: "hidden", border: "1px solid #f3f4f6" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {[{ label: "Buyers", value: "1.2M+", Icon: Users }, { label: "Suppliers", value: "800K+", Icon: BadgeCheck }, { label: "Countries", value: "180+", Icon: Globe }].map(({ label, value, Icon }, i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 0", background: "#fafafa", borderRight: i < 2 ? "1px solid #f3f4f6" : "none" }}>
              <Icon size={13} color="#ef4444" />
              <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>Want to sell on TradeHub?</span>
        <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Become a Supplier <ArrowRight size={11} /></button>
      </div>
    </div>
  );
}

// ─── Mega Menu ────────────────────────────────────────────────────────────────
function UnifiedMegaMenu({ initialCat, onClose }) {
  const [activeCat, setActiveCat] = useState(initialCat || categories[0]);
  const [activeSub, setActiveSub] = useState((initialCat || categories[0]).sub[0]);
  const width = useWindowWidth();
  const showPromo = width >= 1200;

  useEffect(() => { if (initialCat) { setActiveCat(initialCat); setActiveSub(initialCat.sub[0]); } }, [initialCat?.name]);

  return (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderTop: "1px solid #f3f4f6", zIndex: 450, boxShadow: "0 32px 80px rgba(0,0,0,0.11)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", minHeight: 260 }}>
        <div style={{ width: 200, background: "rgba(249,250,251,0.8)", borderRight: "1px solid #f3f4f6", padding: "14px 0", flexShrink: 0 }}>
          <p style={{ padding: "0 18px 8px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>All Categories</p>
          {categories.map(cat => (
            <button key={cat.name} onMouseEnter={() => { setActiveCat(cat); setActiveSub(cat.sub[0]); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", fontSize: 13, textAlign: "left", cursor: "pointer", border: "none", background: activeCat.name === cat.name ? "#fff" : "transparent", color: activeCat.name === cat.name ? "#dc2626" : "#4b5563", fontWeight: activeCat.name === cat.name ? 600 : 400, borderRight: activeCat.name === cat.name ? "2px solid #ef4444" : "2px solid transparent", fontFamily: "inherit" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 400 }}>{cat.count}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ width: 196, borderRight: "1px solid #f3f4f6", padding: "14px 0", flexShrink: 0 }}>
          <p style={{ padding: "0 18px 8px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>{activeCat.name}</p>
          {activeCat.sub.map(sub => (
            <button key={sub.name} onMouseEnter={() => setActiveSub(sub)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", fontSize: 13, textAlign: "left", cursor: "pointer", border: "none", fontWeight: 500, background: activeSub.name === sub.name ? "#fff5f5" : "transparent", color: activeSub.name === sub.name ? "#dc2626" : "#4b5563", borderRight: activeSub.name === sub.name ? "2px solid #ef4444" : "2px solid transparent", fontFamily: "inherit" }}>
              {sub.name} <ChevronRight size={12} color={activeSub.name === sub.name ? "#fca5a5" : "#d1d5db"} />
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: "14px 22px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{activeSub.name}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 18 }}>
            {activeSub.items.map(item => (
              <button key={item} onClick={onClose}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, fontSize: 13, color: "#374151", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontWeight: 500, fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
              ><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", flexShrink: 0, display: "inline-block" }} />{item}</button>
            ))}
          </div>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all in {activeSub.name} <ArrowRight size={13} /></button>
        </div>
        {showPromo && (
          <div style={{ width: 220, flexShrink: 0, padding: "14px 18px 14px 6px" }}>
            <div style={{ height: "100%", background: "linear-gradient(135deg,#dc2626,#991b1b)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px", marginBottom: 10 }}>
                  <Zap size={9} color="#fde047" /><span style={{ fontSize: 9, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>{activeCat.promo.title}</span>
                </div>
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>{activeCat.name}<br />Wholesale</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{activeCat.promo.sub}</p>
              </div>
              <button style={{ position: "relative", zIndex: 1, marginTop: "auto", width: "100%", background: "#fff", color: "#111827", fontSize: 12, fontWeight: 700, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>{activeCat.promo.cta}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Suppliers Dropdown ───────────────────────────────────────────────────────
function SuppliersDropdown() {
  return (
    <div style={{ position: "absolute", top: "calc(100% + 4px)", marginLeft: 250,  background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "8px 0", zIndex: 500, width: 260, boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}>
      <p style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Find Suppliers</p>
      {[{ Icon: Star, label: "Top Rated", desc: "Highest reviewed globally" }, { Icon: Shield, label: "Verified", desc: "Audited & certified" }, { Icon: Globe, label: "Global Network", desc: "180+ countries" }, { Icon: Package, label: "Bulk Specialists", desc: "High-volume orders" }].map(({ Icon: Ic, label, desc }) => (
        <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 13, textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 32, height: 32, background: "#f9fafb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={14} color="#6b7280" /></div>
          <div><div style={{ fontWeight: 600, color: "#1f2937", fontSize: 13, lineHeight: 1.3 }}>{label}</div><div style={{ fontSize: 11, color: "#9ca3af" }}>{desc}</div></div>
        </button>
      ))}
      <div style={{ margin: "6px 16px", borderTop: "1px solid #f3f4f6" }} />
      <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#dc2626", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Browse all suppliers <ArrowRight size={13} /></button>
    </div>
  );
}

// ─── More Dropdown ────────────────────────────────────────────────────────────
function MoreDropdown({ cats, onClose }) {
  return (
    <div style={{ position: "absolute", top: "calc(100% + 4px)", marginLeft:-50, background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "8px 0", zIndex: 500, width: 220, boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}>
      <p style={{ padding: "8px 16px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>More Categories</p>
      {cats.map(cat => (
        <button key={cat.name} onClick={onClose} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 13, textAlign: "left", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div><div style={{ fontWeight: 600, color: "#374151", fontSize: 13 }}>{cat.name}</div><div style={{ fontSize: 10, color: "#9ca3af" }}>{cat.count}</div></div>
        </button>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Header() {
  const [searchCat, setSearchCat] = useState("All Categories");
  const [searchQ, setSearchQ]     = useState("");
  const [cart, setCart]           = useState(3);
  const [wishCount]               = useState(5);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  const width     = useWindowWidth();
  const isMobile  = width < 768;
  const isTablet  = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const nav1Ref = useRef(null);
  const nav2Ref = useRef(null);
  const suppliersRef = useRef(null);
  const moreRef = useRef(null);
  const visibleCats = categories.slice(0, isTablet ? 2 : VISIBLE_CATS);
  const moreCats    = categories.slice(isTablet ? 2 : VISIBLE_CATS);

  useEffect(() => { const s = () => setScrolled(window.scrollY > 4); window.addEventListener("scroll", s); return () => window.removeEventListener("scroll", s); }, []);
  useEffect(() => {
    const h = (e) => { if (nav1Ref.current && !nav1Ref.current.contains(e.target) && nav2Ref.current && !nav2Ref.current.contains(e.target)) setActiveMenu(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (n) => setActiveMenu(a => a === n ? null : n);
  const close  = ()  => setActiveMenu(null);
  const activeCatForMega = activeMenu?.startsWith("cat-") ? categories.find(c => `cat-${c.name}` === activeMenu) || null : null;
  const showMegaMenu = activeMenu === "browse" || activeMenu?.startsWith("cat-");

  const nb = (active) => ({
    display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 48,
    fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", whiteSpace: "nowrap",
    background: active ? "#fff5f5" : "transparent", color: active ? "#dc2626" : "#4b5563",
    borderBottom: active ? "2px solid #ef4444" : "2px solid transparent",
    transition: "all 0.15s", fontFamily: "inherit", flexShrink: 0,
  });

  const navH = isMobile ? 0 : isTablet ? 68 : 76;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f5f7; }
        button, input { font-family: inherit; }
        @keyframes drawerIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* TRUST BAR — tablet + desktop */}
      {!isMobile && (
        <div style={{ background: "#030712" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: isTablet ? 16 : 28 }}>
              {[{ Icon: BadgeCheck, label: "Verified Suppliers", color: "#34d399" }, { Icon: Truck, label: "Worldwide Shipping", color: "#38bdf8" }, { Icon: Zap, label: "Bulk Discounts", color: "#fbbf24" }].map(({ Icon, label, color }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6b7280" }}><Icon size={11} color={color} /> {label}</span>
              ))}
            </div>
            {isDesktop && (
              <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11, color: "#4b5563" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><PhoneCall size={10} /> +1 800-TRADEHUB</span>
                <span style={{ color: "#374151" }}>|</span>
                {["Help Center", "Become a Supplier"].map(t => <span key={t} style={{ cursor: "pointer" }}>{t}</span>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FIRST NAV */}
      <div ref={nav1Ref} style={{ background: "#fff", position: "sticky", top: 0, zIndex: 200, boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none", borderBottom: "1px solid #f3f4f6", transition: "box-shadow 0.3s" }}>

        {/* ── MOBILE ── */}
        {isMobile && (
          <>
            <div style={{ padding: "0 12px", height: 56, display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setMobileOpen(true)} style={{ width: 38, height: 38, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Menu size={20} color="#374151" /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <div style={{ position: "relative", width: 30, height: 30, background: "#dc2626", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={14} color="#fff" />
                </div>
                <div style={{ fontWeight: 900, color: "#111827", fontSize: 16, letterSpacing: "-0.02em" }}>TradeHub</div>
              </div>
              <button style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={18} color="#6b7280" strokeWidth={1.8} />
                <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, background: "#f43f5e", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{wishCount}</span>
              </button>
              <button onClick={() => setCart(c => c + 1)} style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={18} color="#6b7280" strokeWidth={1.8} />
                {cart > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, background: "#dc2626", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart}</span>}
              </button>
            </div>
            {/* Mobile search */}
            <div style={{ padding: "0 12px 12px", display: "flex", gap: 0 }}>
              <div style={{ flex: 1, height: 42, display: "flex", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ width: 38, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Search size={14} color="#9ca3af" /></div>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products, suppliers..."
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#1f2937", background: "#fff", padding: "0 10px" }} />
                <button style={{ width: 42, background: "#dc2626", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Search size={14} color="#fff" /></button>
              </div>
            </div>
          </>
        )}

        {/* ── TABLET ── */}
        {isTablet && (
          <div style={{ padding: "0 16px", height: 68, display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ position: "relative", width: 38, height: 38, background: "#dc2626", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={17} color="#fff" />
                {/* <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: "#0da043", borderRadius: "50%", border: "2px solid #fff" }} /> */}
              </div>
              <div>
                <div style={{ fontWeight: 900, color: "#111827", fontSize: 16, lineHeight: 1 }}>TradeHub</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#f87171", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 1 }}>Wholesale</div>
              </div>
            </a>
            <div style={{ flex: 1, display: "flex" }}>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products, suppliers..."
                style={{ flex: 1, height: 44, padding: "0 14px", fontSize: 13, color: "#1f2937", background: "#fff", border: "1px solid #e5e7eb", borderRight: "none", borderRadius: "12px 0 0 12px", outline: "none" }} />
              <button style={{ height: 44, padding: "0 18px", background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", borderRadius: "0 12px 12px 0", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}><Search size={14} /> Search</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <button style={{ position: "relative", width: 40, height: 40, borderRadius: 12, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={19} color="#6b7280" strokeWidth={1.8} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, background: "#f43f5e", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{wishCount}</span>
              </button>
              <button onClick={() => setCart(c => c + 1)} style={{ position: "relative", width: 40, height: 40, borderRadius: 12, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={19} color="#6b7280" strokeWidth={1.8} />
                {cart > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, background: "#dc2626", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart}</span>}
              </button>
              <div style={{ position: "relative" }}>
                <button onClick={() => toggle("auth")} style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 14px 0 10px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", border: activeMenu === "auth" ? "2px solid #ef4444" : "2px solid #e5e7eb", background: activeMenu === "auth" ? "#fff5f5" : "#fff", color: activeMenu === "auth" ? "#dc2626" : "#374151" }}>
                  <UserCircle2 size={16} color={activeMenu === "auth" ? "#dc2626" : "#6b7280"} /> Sign In
                </button>
                {activeMenu === "auth" && <AuthDropdown />}
              </div>
            </div>
          </div>
        )}

        {/* ── DESKTOP ── */}
        {isDesktop && (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 76, display: "flex", alignItems: "center", gap: 20 }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ position: "relative", width: 44, height: 44, background: "#dc2626", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }}>
                <Building2 size={20} color="#fff" />
                {/* <span style={{ position: "absolute", top: -2, right: -2, width: 12, height: 12, background: "#4ade80", borderRadius: "50%", border: "2px solid #fff" }} /> */}
              </div>
              <div>
                <div style={{ fontWeight: 900, color: "#111827", fontSize: 19, lineHeight: 1, letterSpacing: "-0.02em" }}>TradeHub</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#f87171", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 2 }}>Wholesale</div>
              </div>
            </a>
            <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
              <SearchCatDropdown selected={searchCat} onSelect={setSearchCat} />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && close()} placeholder="Search products, suppliers, brands..."
                style={{ flex: 1, minWidth: 0, height: 48, padding: "0 16px", fontSize: 14, color: "#1f2937", background: "#fff", border: "1px solid #e5e7eb", borderLeft: "none", borderRight: "none", outline: "none" }} />
              <button style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px", background: "#dc2626", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", borderRadius: "0 16px 16px 0", cursor: "pointer", flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={e => e.currentTarget.style.background = "#dc2626"}
              ><Search size={15} /> Search</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <button style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 16, color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", gap: 2 }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Heart size={20} strokeWidth={1.8} />
                <span style={{ position: "absolute", top: 8, right: 8, minWidth: 15, height: 15, background: "#f43f5e", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>{wishCount}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af" }}>Wishlist</span>
              </button>
              <button onClick={() => setCart(c => c + 1)} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 16, color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", gap: 2 }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <ShoppingCart size={20} strokeWidth={1.8} />
                {cart > 0 && <span style={{ position: "absolute", top: 8, right: 8, minWidth: 15, height: 15, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>{cart}</span>}
                <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af" }}>Cart</span>
              </button>
              <div style={{ width: 1, height: 32, background: "#e5e7eb", margin: "0 4px" }} />
              <div style={{ position: "relative" }}>
                <button onClick={() => toggle("auth")} style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px 0 12px", borderRadius: 16, fontSize: 14, fontWeight: 600, cursor: "pointer", border: activeMenu === "auth" ? "2px solid #ef4444" : "2px solid #e5e7eb", background: activeMenu === "auth" ? "#fff5f5" : "#fff", color: activeMenu === "auth" ? "#dc2626" : "#374151", transition: "all 0.15s" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: activeMenu === "auth" ? "#dc2626" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}><UserCircle2 size={15} color={activeMenu === "auth" ? "#fff" : "#6b7280"} /></div>
                  Sign In <ChevronDown size={13} color={activeMenu === "auth" ? "#dc2626" : "#9ca3af"} style={{ transform: activeMenu === "auth" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {activeMenu === "auth" && <AuthDropdown />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECOND NAV — tablet + desktop */}
      {!isMobile && (
        <div ref={nav2Ref} style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", position: "sticky", top: navH, zIndex: 190, boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.06)" : "none", transition: "box-shadow 0.3s" }}>
          {/* Wrapper with position:relative so dropdowns anchor to it, NOT the overflow container */}
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", height: 48, overflowX: "auto", overflowY: "visible", msOverflowStyle: "none", scrollbarWidth: "none" }}>
              <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px", flexShrink: 0 }} />

              <button onClick={() => toggle("browse")} style={{ ...nb(false), background: activeMenu === "browse" ? "#dc2626" : "transparent", color: activeMenu === "browse" ? "#fff" : "#1f2937", fontWeight: 700, borderBottom: activeMenu === "browse" ? "2px solid #b91c1c" : "2px solid transparent" }}
                onMouseEnter={e => { if (activeMenu !== "browse") { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; } }}
                onMouseLeave={e => { if (activeMenu !== "browse") { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.background = "transparent"; } }}
              ><Grid3x3 size={14} /> Browse All Categories <ChevronDown size={11} style={{ transform: activeMenu === "browse" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>

              <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px", flexShrink: 0 }} />

              <button onClick={close} style={nb(false)}
              
                onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; }}
              ><Home size={14} /> Home</button>

              <div style={{ position: "relative" }}>
                <button ref={suppliersRef} onClick={() => toggle("suppliers")} style={nb(activeMenu === "suppliers")}
                  onMouseEnter={e => { if (activeMenu !== "suppliers") { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; } }}
                  onMouseLeave={e => { if (activeMenu !== "suppliers") { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; } }}
                ><Users size={14} /> Suppliers <ChevronDown size={11} style={{ transform: activeMenu === "suppliers" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>
              </div>

        {/* GAP BETWEEN LEFT GROUP AND CATEGORIES */}
        {/* <div style={{ width: 100 }} /> */}

              {visibleCats.map(cat => (
                <div key={cat.name} style={{ position: "relative", flexShrink: 0 }}>
                  <button onClick={() => toggle(`cat-${cat.name}`)} style={nb(activeMenu === `cat-${cat.name}`)}
                    onMouseEnter={e => { if (activeMenu !== `cat-${cat.name}`) { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; } }}
                    onMouseLeave={e => { if (activeMenu !== `cat-${cat.name}`) { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    {cat.name} <ChevronDown size={10} style={{ transform: activeMenu === `cat-${cat.name}` ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                </div>
              ))}

              {/* More button — inside scroll area for layout, dropdown anchored outside */}
              <button ref={moreRef} onClick={() => toggle("more")} style={{ ...nb(activeMenu === "more")}}
                onMouseEnter={e => { if (activeMenu !== "more") { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; } }}
                onMouseLeave={e => { if (activeMenu !== "more") { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; } }}
              ><MoreHorizontal size={15} /> More <ChevronDown size={10} style={{ transform: activeMenu === "more" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>

            </div>

            {/* Dropdowns rendered OUTSIDE the overflow:auto container so they aren't clipped */}
            {activeMenu === "suppliers" && (
              <div style={{ position: "absolute", top: "100%", left: suppliersRef.current ? suppliersRef.current.offsetLeft : 0, zIndex: 500 }}>
                <SuppliersDropdown />
              </div>
            )}
            {activeMenu === "more" && (
              <div style={{ position: "absolute", top: "100%", left: moreRef.current ? moreRef.current.offsetLeft : "auto", zIndex: 500 }}>
                <MoreDropdown cats={moreCats} onClose={close} />
              </div>
            )}
          </div>
          {showMegaMenu && <UnifiedMegaMenu initialCat={activeCatForMega} onClose={close} />}
        </div>
      )}

      {/* MOBILE DRAWER */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}