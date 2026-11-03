"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/components/account-dropdown";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

const newRelease = [
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-1.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-2.png" },
  { name: "Oversized Sheer Knitted Jumper", price: "N40, 000 ($44)", image: "/images/product-3.png" },
];
const allProducts = [
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-5.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-6.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-7.png" },
  { name: "Oversized Sheer Knitted Jumper", price: "N40, 000 ($44)", image: "/images/product-8.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/affiliate.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/store.png" },
];

function ProductGrid({ items, saved, onSave, gridRef }: {
  items: typeof newRelease;
  saved: string[];
  onSave: (product: (typeof newRelease)[number], id: string) => void;
  gridRef: { current: HTMLUListElement | null };
}) {
  return <div className="product-carousel">
    <ul className="product-grid" ref={gridRef}>
    {items.map((product, index) => {
      const id = `${product.name}-${product.image}`;
      const isSaved = saved.includes(id);
      return <li className="product-card" key={`${product.image}-${index}`}>
        <div className="product-image">
          <Link className="product-image-link" href="/product/oversized-bear-vest" aria-label={`View ${product.name} product details`}><Image src={product.image} alt={`image of ${product.name}`} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 46vw, 30vw" /></Link>
          <Button variant="outline" size="icon" className={`save-button${isSaved ? " is-saved" : ""}`} aria-label={`${isSaved ? "Remove" : "Add"} ${product.name} ${isSaved ? "from" : "to"} wishlist`} aria-pressed={isSaved} onClick={() => onSave(product, id)}><Heart aria-hidden="true" fill={isSaved ? "currentColor" : "none"} /></Button>
        </div>
        <div className="product-details"><div><h3><Link href="/product/oversized-bear-vest">{product.name}</Link></h3><p>{product.price}</p></div></div>
      </li>;
    })}
    </ul>
  </div>;
}

export default function Home() {
  const { cartCount, wishlistProductIds, toggleWishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const newReleaseGridRef = useRef<HTMLUListElement>(null);
  const allProductsGridRef = useRef<HTMLUListElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const saveProduct = (product: (typeof newRelease)[number], id: string) => toggleWishlist(id, product.name, product.price);
  const scrollProducts = (gridRef: { current: HTMLUListElement | null }, direction: -1 | 1) => {
    const grid = gridRef.current;
    const firstCard = grid?.firstElementChild;
    if (!grid || !(firstCard instanceof HTMLElement)) return;
    const gap = Number.parseFloat(window.getComputedStyle(grid).columnGap) || 0;
    grid.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  return <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <header className="site-header">
      <div className="header-top" onKeyDown={(event) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); } }}>
        <Button ref={menuButtonRef} className="mobile-menu" variant="ghost" size="icon" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</Button>
        <a className="brand" href="#top" aria-label="Urban home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></a>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation"><a href="#top" onClick={() => setMenuOpen(false)}>Home</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><Link href="/products" onClick={() => setMenuOpen(false)}>Product</Link><a href="#products" onClick={() => setMenuOpen(false)}>Wishlist{wishlistProductIds.length > 0 && <span className="cart-count nav-count" aria-hidden="true">( {wishlistProductIds.length} )</span>}</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact us</a></nav>
      </div>
      <div className="header-tools">
        <form className="search-form" role="search" action="/search" method="get"><label className="sr-only" htmlFor="site-search">Search products</label><Image className="search-icon" src="/images/search.svg" alt="" width={24} height={24} aria-hidden="true" /><input id="site-search" type="search" placeholder="Search" name="q" /></form>
        <Button variant="ghost" className="header-cart" aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}><ShoppingCart aria-hidden="true" /><span className="cart-count" aria-hidden="true">( {cartCount} )</span></Button>
        <AccountDropdown />
      </div>
    </header>

    <main id="main-content" tabIndex={-1}>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <h1 id="hero-title">URBAN STYLES</h1>
        <div className="hero-gallery">
          <div className="hero-image hero-side"><Image src="/images/hero-left.png" alt="image of Urban Styles graphic t-shirt collection" fill priority sizes="(max-width: 700px) 30vw, 29vw" /></div>
          <div className="hero-image hero-center"><Image src="/images/hero-center.png" alt="image of Urban Styles black hoodie collection" fill priority sizes="(max-width: 700px) 40vw, 29vw" /></div>
          <div className="hero-image hero-side"><Image src="/images/hero-right.png" alt="image of Urban Styles graphic t-shirt collection" fill priority sizes="(max-width: 700px) 30vw, 29vw" /></div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title"><div className="about-copy"><h2 id="about-title">About</h2><p>At Urban Styles, We&apos;re Not Just A Fashion Destination; We&apos;re A Cultural Movement. We Understand That Clothing Isn&apos;t Just Something You Wear; It&apos;s A Statement, A Reflection Of Your Identity And The Vibrant Urban World You Inhabit</p><a className="text-link" href="#contact">See more <ArrowRight aria-hidden="true" /></a></div><div className="about-image"><Image src="/images/about.png" alt="image of Urban Styles fashion campaign" fill sizes="(max-width: 700px) 100vw, 90vw" /></div></section>

      <section className="product-section" id="new-release" aria-labelledby="new-release-title"><div className="section-heading"><div><h2 id="new-release-title">New Release</h2><p>All items available for purchase</p></div><div className="section-heading-actions"><div className="carousel-controls" role="group" aria-label="New Release carousel controls"><Button variant="outline" className="carousel-button" aria-label="Show previous New Release products" onClick={() => scrollProducts(newReleaseGridRef, -1)}><ChevronLeft aria-hidden="true" /></Button><Button variant="outline" className="carousel-button" aria-label="Show next New Release products" onClick={() => scrollProducts(newReleaseGridRef, 1)}><ChevronRight aria-hidden="true" /></Button></div><Link href="/products" className="see-all">See all</Link></div></div><ProductGrid items={newRelease} saved={wishlistProductIds} onSave={saveProduct} gridRef={newReleaseGridRef} /></section>

      <section className="affiliate" aria-labelledby="affiliate-title"><Image src="/images/product-4.png" alt="image of urban styles store" fill sizes="(max-width: 700px) 100vw, 90vw" /><div className="affiliate-overlay" /><div className="affiliate-content"><h2 id="affiliate-title">Own a store?<br />Become Our Affiliate</h2><p>Become a part of the chorus and unlock exciting opportunities for mutual growth and success.</p><a className="affiliate-button" href="mailto:support@urbanstyles.com">Contact sales <ArrowRight aria-hidden="true" /></a></div></section>

      <section className="product-section all-products" id="products" aria-labelledby="products-title"><div className="section-heading"><div><h2 id="products-title">All Products</h2><p>All items available for purchase</p></div><div className="section-heading-actions"><div className="carousel-controls" role="group" aria-label="All Products carousel controls"><Button variant="outline" className="carousel-button" aria-label="Show previous All Products" onClick={() => scrollProducts(allProductsGridRef, -1)}><ChevronLeft aria-hidden="true" /></Button><Button variant="outline" className="carousel-button" aria-label="Show next All Products" onClick={() => scrollProducts(allProductsGridRef, 1)}><ChevronRight aria-hidden="true" /></Button></div><Link href="/products" className="see-all">See all</Link></div></div><ProductGrid items={allProducts} saved={wishlistProductIds} onSave={saveProduct} gridRef={allProductsGridRef} /></section>

      <section className="newsletter" aria-labelledby="newsletter-title"><Image src="/images/newsletter.png" alt="image of Urban Styles latest fashion campaign" fill sizes="(max-width: 700px) 100vw, 90vw" /><div className="newsletter-overlay" /><div className="newsletter-content"><h2 id="newsletter-title">Be The First To Know<br className="desktop-break" /> About Our New Release</h2><p>Amazing product on its way, Subscribe and be the first to know<br className="desktop-break" /> when we release new product.</p><form className="subscribe-form" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); toast.add({ title: "You’re Subscribed", type: "success" }); }}><label className="sr-only" htmlFor="subscribe-email">Enter your email</label><input id="subscribe-email" type="email" placeholder="Enter your email" required /><Button type="submit" variant="secondary">Subscribe</Button></form>{subscribed && <p role="status" className="subscribe-status">Thank you for subscribing.</p>}</div></section>
    </main>

    <footer className="site-footer" id="contact"><div className="footer-logo-row"><span /><a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></a><span /></div><nav className="footer-nav" aria-label="Footer navigation"><a href="#top">Home</a><a href="#about">About</a><Link href="/products">Product</Link><a href="#products">Wishlist</a><a href="#products">Cart</a><a href="#contact">Contact us</a></nav><div className="footer-info"><section><h2>Contact</h2><address>Email: Support@Urbanstyles.Com<br />Phone: (555) 555-5555, (222) 222-2222<br />No 22, Lekki Ajah Complex Hall</address></section><section><h2>Socials</h2><a href="https://twitter.com">Twitter</a><a href="https://instagram.com">Instagram</a><a href="https://facebook.com">facebook</a></section><section><h2>Business Hours</h2><p>Monday to Friday: 9:00 AM to 6:00 PM (EST)<br />Saturday: 12:00 AM to 6:00 PM (EST)<br />Closed on sunday</p></section></div><div className="footer-terms"><a href="#contact">Terms &amp; Condition</a></div></footer>
  </>;
}
