"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent } from "react";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/components/account-dropdown";
import { useStore } from "@/lib/store";

const product = { id: "oversized-bear-vest", name: "Oversized Bear Vest", price: "N40,000 ($40)" };
const gallery = [
  { src: "/images/product-detail/product-main.png", alt: "image of Oversized Bear Vest, blue, full-length back view" },
  { src: "/images/product-detail/product-front.png", alt: "image of Oversized Bear Vest, blue, front view" },
  { src: "/images/product-detail/product-back.png", alt: "image of Oversized Bear Vest, blue, close back view" },
];
const reviews = [
  { name: "Olayode Ajibola", location: "Lagos, Nigeria", avatar: "/images/product-detail/review-1.png", text: "The unique approach to streetwear is refreshing, and I’m hooked. The Reverse Stitch Hoodie I got is my new favorite cold-weather companion." },
  { name: "Coco Jones", location: "", avatar: "/images/product-detail/review-2.png", text: "I appreciate brands that pay attention to both style and substance. URBAN’s commitment to high-quality materials and craftsmanship is evident in every piece." },
  { name: "Balikis Kohinoor", location: "Lagos, Nigeria", avatar: "/images/product-detail/review-3.png", text: "The unique designs and limited-edition pieces make me feel like I’m part of an exclusive club." },
  { name: "Mike Ballack", location: "Lagos, Nigeria", avatar: "/images/product-detail/review-1.png", text: "The commitment to same-day delivery is impressive, and I love that they encourage exchanges to reduce waste." },
];
const related = [
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-1.png" },
  { name: "Slim V Neck Limited Pique Polo", price: "N40, 000 ($44)", image: "/images/product-2.png" },
  { name: "Oversized Sheer Knitted Jumper", price: "N40, 000 ($44)", image: "/images/product-3.png" },
];

export default function ProductDetailPage() {
  const { cartCount, wishlistProductIds, addToCart, toggleWishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("XL");
  const [color, setColor] = useState("Blue");
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});
  const [reviewMessage, setReviewMessage] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inWishlist = wishlistProductIds.includes(product.id);

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Enter your full name.";
    if (!email) errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
    if (!message) errors.message = "Write your review before submitting.";
    setReviewErrors(errors);
    if (Object.keys(errors).length > 0) {
      setReviewMessage("Please correct the highlighted fields.");
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setReviewMessage("Review submission isn’t available right now. Your entries are still here; please try again later.");
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = activeTab === "reviews" ? 0 : 1;
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex + 1) % 2;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      setActiveTab(nextIndex === 0 ? "reviews" : "related");
      tabRefs.current[nextIndex]?.focus();
    }
  }

  return <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <header className="site-header">
      <div className="header-top" onKeyDown={(event) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); } }}>
        <Button ref={menuButtonRef} className="mobile-menu" variant="ghost" size="icon" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</Button>
        <Link className="brand" href="/" aria-label="Urban home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></Link>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation"><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link><Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link><Link href="/products" onClick={() => setMenuOpen(false)}>Product</Link><Link href="/#products" onClick={() => setMenuOpen(false)}>Wishlist{wishlistProductIds.length > 0 && <span className="cart-count nav-count" aria-hidden="true">( {wishlistProductIds.length} )</span>}</Link><Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact us</Link></nav>
      </div>
      <div className="header-tools">
        <form className="search-form" role="search" action="/search" method="get"><label className="sr-only" htmlFor="product-search">Search products</label><Image className="search-icon" src="/images/search.svg" alt="" width={24} height={24} aria-hidden="true" /><input id="product-search" type="search" placeholder="Search" name="q" /></form>
        <Button variant="ghost" className="header-cart" aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => document.getElementById("product-actions")?.scrollIntoView({ behavior: "smooth" })}><ShoppingCart aria-hidden="true" /><span className="cart-count" aria-hidden="true">( {cartCount} )</span></Button>
        <AccountDropdown />
      </div>
    </header>

    <main className="product-detail-page" id="main-content" tabIndex={-1}>
      <section className="product-detail" aria-labelledby="product-details-title">
        <h1 id="product-details-title">Product Details</h1>
        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="product-thumbnails" role="group" aria-label={`${product.name} image views`}>
              {gallery.slice(1).map((image, index) => { const imageIndex = index + 1; const view = index === 0 ? "front" : "close back"; return <button className={`thumbnail${activeImage === imageIndex ? " selected" : ""}`} key={image.src} type="button" onClick={() => setActiveImage(imageIndex)} aria-label={`Show ${view} view of ${product.name}`} aria-pressed={activeImage === imageIndex}><Image src={image.src} alt="" fill sizes="190px" /></button>; })}
            </div>
              <div className="product-main-image"><Image src={gallery[activeImage].src} alt={gallery[activeImage].alt} fill priority sizes="(max-width: 700px) 100vw, 416px" /></div>
          </div>

          <div className="product-detail-copy">
            <div className="product-description"><h2>{product.name}</h2><p>The Oversized Overdye Extended Neck Teddy T-Shirt blends contemporary aesthetics with a classic touch. The extended neck design adds an edgy twist, making sure you catch every eye as you make your mark on the urban landscape.</p><p className="detail-price" aria-label="40,000 Nigerian naira, 40 US dollars">N40,000&nbsp; ($40)</p></div>

            <div className="product-options">
              <fieldset className="color-options"><legend className="sr-only">Color for {product.name}</legend>{[{ name: "Blue", value: "#68d1df" }, { name: "Red", value: "#ff4238" }, { name: "Black", value: "#1f0404" }].map((item) => <label key={item.name} title={item.name}><input type="radio" name="color" value={item.name} checked={color === item.name} onChange={() => setColor(item.name)} /><span className="color-swatch" style={{ "--swatch": item.value } as CSSProperties}><span className="sr-only">{item.name}</span></span></label>)}</fieldset>
              <fieldset className="size-options"><legend className="sr-only">Size for {product.name}</legend>{["XL", "L", "M", "S"].map((item) => <label key={item}><input type="radio" name="size" value={item} checked={size === item} onChange={() => setSize(item)} /><span>{item}</span></label>)}</fieldset>
            </div>

            <div className="product-action-row" id="product-actions"><Button type="button" variant="outline" className="wishlist-action" aria-label={`${inWishlist ? "Remove" : "Add"} ${product.name} ${inWishlist ? "from" : "to"} wishlist`} aria-pressed={inWishlist} onClick={() => toggleWishlist(product.id, product.name, product.price)}><Heart aria-hidden="true" fill={inWishlist ? "currentColor" : "none"} />{inWishlist ? "Added to wishlist" : "Add to wishlist"}</Button><Button type="button" className="cart-action" aria-label={`Add to cart, ${product.name}, colour ${color}, size ${size}`} onClick={() => addToCart({ productId: product.id, variantId: `${product.id}-${color.toLowerCase()}-${size.toLowerCase()}`, name: product.name, color, size, price: product.price })}>Add to cart</Button></div>
          </div>
        </div>
      </section>

      <section className="product-feedback" aria-label="Product reviews and related products">
        <div className="detail-tabs" role="tablist" aria-label="Product information">
          <button type="button" role="tab" id="reviews-tab" ref={(element) => { tabRefs.current[0] = element; }} tabIndex={activeTab === "reviews" ? 0 : -1} aria-selected={activeTab === "reviews"} aria-controls="reviews-panel" onKeyDown={onTabKeyDown} onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? "active" : ""}>Review <span>(4)</span></button>
          <button type="button" role="tab" id="related-tab" ref={(element) => { tabRefs.current[1] = element; }} tabIndex={activeTab === "related" ? 0 : -1} aria-selected={activeTab === "related"} aria-controls="related-panel" onKeyDown={onTabKeyDown} onClick={() => setActiveTab("related")} className={activeTab === "related" ? "active" : ""}>Related product</button>
        </div>

        <div id="reviews-panel" role="tabpanel" tabIndex={0} aria-labelledby="reviews-tab" hidden={activeTab !== "reviews"} className="reviews-layout">
          <section className="reviews-list" aria-labelledby="reviews-heading"><h2 id="reviews-heading">Reviews</h2><ol tabIndex={0} aria-label="Customer reviews; scroll vertically to read all four reviews">{reviews.map((review) => <li className="review-card" key={review.name}><article aria-label={`Review by ${review.name}`}><div className="review-identity"><Image src={review.avatar} alt="" width={64} height={64} /><div><h3>{review.name}</h3>{review.location && <p>{review.location}</p>}</div></div><p className="review-copy">{review.text}</p></article></li>)}</ol></section>
          <section className="review-form-section" aria-labelledby="add-review-heading"><h2 id="add-review-heading">Add review</h2><p className="review-note">Your email will not appear with your review.</p><form className="review-form" noValidate onSubmit={submitReview} onChange={(event) => { const field = event.target; if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return; if (reviewErrors[field.name]) setReviewErrors((current) => ({ ...current, [field.name]: "" })); }}>
            <label htmlFor="review-name">Full name <span aria-hidden="true">*</span></label><input id="review-name" name="name" autoComplete="name" aria-invalid={!!reviewErrors.name} aria-describedby={reviewErrors.name ? "review-name-error" : undefined} required />{reviewErrors.name && <p className="field-error" id="review-name-error">{reviewErrors.name}</p>}
            <label htmlFor="review-email">Email <span aria-hidden="true">*</span></label><input id="review-email" name="email" type="email" autoComplete="email" aria-invalid={!!reviewErrors.email} aria-describedby={reviewErrors.email ? "review-email-error" : undefined} required />{reviewErrors.email && <p className="field-error" id="review-email-error">{reviewErrors.email}</p>}
            <label htmlFor="review-message">Write message <span aria-hidden="true">*</span></label><textarea id="review-message" name="message" aria-invalid={!!reviewErrors.message} aria-describedby={reviewErrors.message ? "review-message-error" : undefined} required />{reviewErrors.message && <p className="field-error" id="review-message-error">{reviewErrors.message}</p>}
            <div className="review-submit-row"><Button type="submit">Submit</Button></div>{reviewMessage && <p className="review-success" role="status">{reviewMessage}</p>}
          </form></section>
        </div>

        <div id="related-panel" role="tabpanel" tabIndex={0} aria-labelledby="related-tab" hidden={activeTab !== "related"} className="related-products"><h2 className="sr-only">Related products</h2><ul>{related.map((product) => <li key={product.image}><Link href="/product/oversized-bear-vest"><div className="related-image"><Image src={product.image} alt={`image of ${product.name}`} fill sizes="(max-width: 700px) 80vw, 33vw" /></div><h3>{product.name}</h3><p>{product.price}</p></Link></li>)}</ul></div>
      </section>
    </main>

    <footer className="site-footer" id="contact"><div className="footer-logo-row"><span /><Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></Link><span /></div><nav className="footer-nav" aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/#about">About</Link><Link href="/products">Product</Link><Link href="/#products">Wishlist</Link><Link href="/#products">Cart</Link><Link href="/#contact">Contact us</Link></nav><div className="footer-info"><section><h2>Contact</h2><address>Email: Support@Urbanstyles.Com<br />Phone: (555) 555-5555, (222) 222-2222<br />No 22, Lekki Ajah Complex Hall</address></section><section><h2>Socials</h2><a href="https://twitter.com">Twitter</a><a href="https://instagram.com">Instagram</a><a href="https://facebook.com">facebook</a></section><section><h2>Business Hours</h2><p>Monday to Friday: 9:00 AM to 6:00 PM (EST)<br />Saturday: 12:00 AM to 6:00 PM (EST)<br />Closed on sunday</p></section></div><div className="footer-terms"><a href="#contact">Terms &amp; Condition</a></div></footer>
  </>;
}
