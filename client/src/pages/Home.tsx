/*
 * Chrome Ritual — Iteración 2.
 * Menos texto, más presencia visual, más ritmo editorial y una estructura más apta
 * para móvil. Cada bloque debe sentirse más vivo, táctil y específico de marca.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Instagram,
  LocateFixed,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  SwatchBook,
  Trophy,
  Waves,
  X,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Product = {
  id: string;
  badge: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  wholesalePrice: number;
  wholesaleMin: number;
  category: "player" | "fan" | "other";
  sizes: string[];
  accent: string;
  accentSoft: string;
  image?: string;
  features: string[];
};

type CartItem = {
  id: string;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  accent: string;
};

type SelectorState = Record<
  string,
  {
    size: string;
    quantity: number;
  }
>;

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: "envio" | "retiro";
  city: string;
  neighborhood: string;
  address: string;
  reference: string;
};

const WHATSAPP_NUMBER = "573206473108";
const WHATSAPP_DISPLAY = "+57 3206473108";
const WHATSAPP_FORMATTED = "+57 3206473108";
const INSTAGRAM_URL = "https://www.instagram.com/boutiquelaguaca1/";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663548466589/HjT5TMGRubruxMoHSY3yLf/la-guaca-hero-reference-U2Loqi89sFxEsxcefVFjur.webp";
const PLAYER_IMAGE = "/products/player-front.webp";
const TRAINING_IMAGE = "/products/training-front.webp";
const FAN_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663548466589/HjT5TMGRubruxMoHSY3yLf/la-guaca-fan-duo-hhThqd6xYALcd5AE3rWG8W.webp";
const FABRIC_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663548466589/HjT5TMGRubruxMoHSY3yLf/la-guaca-fabric-detail-e3sVWKbTbUzTmAyWSXEKhC.webp";

const PLAYER_FRONT = "/products/player-front.webp";
const PLAYER_BACK = "/products/player-back.webp";
const PLAYER_BADGE = "/products/player-badge.webp";
const PLAYER_STRIPES = "/products/player-stripes.webp";

const TRAINING_FRONT = "/products/training-front.webp";
const TRAINING_BACK = "/products/training-back.webp";
const TRAINING_SLEEVE = "/products/training-sleeve.webp";
const TRAINING_BADGE = "/products/training-badge.webp";

const FAN_DAMA_FRONT = "/products/fan-dama-front.webp";
const FAN_DAMA_BADGE = "/products/fan-dama-badge.webp";
const FAN_DAMA_SLEEVE = "/products/fan-dama-sleeve.webp";

const FAN_CAB_FRONT = "/products/fan-caballero-front.webp";
const FAN_CAB_BADGE = "/products/fan-caballero-badge.webp";

const PRODUCTS: Product[] = [
  {
    id: "player-caballero",
    badge: "Versión player",
    name: "Camiseta Player Local · Caballero",
    shortName: "Player Caballero",
    description: "La pieza de mayor impacto: atlética, brillante y lista para protagonizar.",
    price: 90000,
    wholesalePrice: 75000,
    wholesaleMin: 6,
    category: "player",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    accent: "oklch(0.86 0.15 85)",
    accentSoft: "oklch(0.86 0.15 85 / 0.16)",
    image: PLAYER_IMAGE,
    features: ["Ajuste pro", "Tela ligera", "Escudo premium", "Look de studio"],
  },
  {
    id: "player-dama",
    badge: "Edición player",
    name: "Camiseta Player Local · Dama",
    shortName: "Player Dama",
    description: "Silueta más refinada, misma energía de cancha.",
    price: 90000,
    wholesalePrice: 75000,
    wholesaleMin: 6,
    category: "player",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    accent: "oklch(0.63 0.2 28)",
    accentSoft: "oklch(0.63 0.2 28 / 0.16)",
    features: ["Corte estilizado", "Textura premium", "Presencia limpia"],
  },
  {
    id: "player-nino",
    badge: "Colección junior",
    name: "Camiseta Player Local · Niño",
    shortName: "Player Niño",
    description: "Ligera, resistente y lista para jugar o alentar.",
    price: 90000,
    wholesalePrice: 75000,
    wholesaleMin: 6,
    category: "player",
    sizes: ["6", "8", "10", "12", "14", "16"],
    accent: "oklch(0.57 0.17 258)",
    accentSoft: "oklch(0.57 0.17 258 / 0.16)",
    features: ["Junior fit", "Fácil de mover", "Hecha para durar"],
  },
  {
    id: "training-white",
    badge: "Cromo blanco",
    name: "Camiseta Entrenamiento Blanca 2026",
    shortName: "Entrenamiento Blanca",
    description: "Fría, limpia y técnica. Una lectura más futurista de la colección.",
    price: 90000,
    wholesalePrice: 90000,
    wholesaleMin: 999,
    category: "other",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    accent: "oklch(0.57 0.17 258)",
    accentSoft: "oklch(0.57 0.17 258 / 0.16)",
    image: TRAINING_IMAGE,
    features: ["Brillo frío", "Detalles plateados", "Look minimal", "Silenciosa y premium"],
  },
  {
    id: "fan-caballero",
    badge: "Versión hincha",
    name: "Camiseta Hincha · Caballero",
    shortName: "Hincha Caballero",
    description: "Más relajada, igual de tricolor.",
    price: 80000,
    wholesalePrice: 49000,
    wholesaleMin: 12,
    category: "fan",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    accent: "oklch(0.86 0.15 85)",
    accentSoft: "oklch(0.86 0.15 85 / 0.16)",
    features: ["Uso diario", "Corte cómodo", "Escudo con carácter"],
  },
  {
    id: "fan-dama",
    badge: "Versión hincha",
    name: "Camiseta Hincha · Dama",
    shortName: "Hincha Dama",
    description: "Una versión más liviana y urbana para la tribuna y la calle.",
    price: 80000,
    wholesalePrice: 49000,
    wholesaleMin: 12,
    category: "fan",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    accent: "oklch(0.63 0.2 28)",
    accentSoft: "oklch(0.63 0.2 28 / 0.16)",
    features: ["Perfil suave", "Moda + partido", "Fácil de llevar"],
  },
];

const HERO_STATS = [
  { label: "Drops", value: "3" },
  { label: "Checkout", value: "WhatsApp" },
  { label: "Mayorista", value: "20%" },
];

const HERO_SCENES = [
  {
    id: "player-section",
    label: "Drop 01",
    title: "Player",
    note: "La más intensa",
    image: PLAYER_IMAGE,
    accent: "oklch(0.86 0.15 85)",
  },
  {
    id: "training-section",
    label: "Drop 02",
    title: "Training",
    note: "Fría y técnica",
    image: TRAINING_IMAGE,
    accent: "oklch(0.57 0.17 258)",
  },
  {
    id: "fan-section",
    label: "Drop 03",
    title: "Hincha",
    note: "La más urbana",
    image: FAN_IMAGE,
    accent: "oklch(0.63 0.2 28)",
  },
];

const HERO_JERSEY_SLIDES = [
  {
    id: "player",
    label: "Drop 01",
    title: "Player Local",
    note: "Caballero",
    sideLabel: "Boutique edit",
    sideTitle: "Compra directa",
    sideNote: "Sin fricción",
    specs: ["Pro fit", "Tela ligera", "Escudo premium"],
    front: PLAYER_FRONT,
    back: PLAYER_BACK,
    accent: "oklch(0.86 0.15 85)",
  },
  {
    id: "training",
    label: "Drop 02",
    title: "Training Blanca",
    note: "Fría y técnica",
    sideLabel: "Training edit",
    sideTitle: "Perfil técnico",
    sideNote: "Ligera y fresca",
    specs: ["Cromo blanco", "Textura pro", "Corte técnico"],
    front: TRAINING_FRONT,
    back: TRAINING_BACK,
    accent: "oklch(0.57 0.17 258)",
  },
  {
    id: "fan",
    label: "Drop 03",
    title: "Hincha",
    note: "Caballero / Dama",
    sideLabel: "Street edit",
    sideTitle: "Look urbano",
    sideNote: "Confort premium",
    specs: ["Fit diario", "Tela suave", "Escudo hincha"],
    front: FAN_CAB_FRONT,
    back: null,
    accent: "oklch(0.63 0.2 28)",
  },
] as const;

const STORY_CARDS = [
  {
    icon: Trophy,
    title: "Player",
    text: "La silueta que abre el drop con más impacto.",
    accent: "oklch(0.86 0.15 85)",
  },
  {
    icon: Waves,
    title: "Training",
    text: "Un tono más frío, limpio y técnico.",
    accent: "oklch(0.57 0.17 258)",
  },
  {
    icon: SwatchBook,
    title: "Hincha",
    text: "Comodidad premium para tribuna y calle.",
    accent: "oklch(0.63 0.2 28)",
  },
];

const WHOLESALE_TIERS = [
  {
    label: "Player",
    unitPrice: 90000,
    wholesalePrice: 75000,
    detail: "Caballero · Dama · Niño",
    min: "6+ uds. → precio mayorista",
    accent: "oklch(0.86 0.15 85)",
  },
  {
    label: "Hincha",
    unitPrice: 80000,
    wholesalePrice: 49000,
    detail: "Caballero · Dama",
    min: "12+ uds. → precio mayorista",
    accent: "oklch(0.63 0.2 28)",
  },
];

const WHOLESALE_WHATSAPP_TEXT = [
  "Hola La Guaca, quiero cotizar compra al por mayor.",
  "",
  "Datos rápidos:",
  "- Versión de interés:",
  "- Cantidad estimada:",
  "- Ciudad de entrega:",
].join("\n");

const QUICK_TESTIMONIALS = [
  { quote: "Me respondieron en minutos y llegó todo perfecto.", author: "Andrea · Montería" },
  { quote: "Calidad top, tallaje claro y compra sin vueltas.", author: "Luis · Cereté" },
  { quote: "Para mayorista fue súper rápido cerrar por WhatsApp.", author: "Karen · Sincelejo" },
];

const PRODUCT_COMPARISON = [
  {
    label: "Player",
    fit: "Ajustado pro",
    ideal: "Partido / colección",
    price: "Unidad $90.000 · Si sumas 6+ player (cualquier talla), cada una queda en $75.000",
  },
  {
    label: "Training",
    fit: "Regular técnico",
    ideal: "Uso diario premium",
    price: "Unidad $90.000",
  },
  {
    label: "Hincha",
    fit: "Cómodo urbano",
    ideal: "Tribuna / calle",
    price: "Unidad $80.000 · Si sumas 12+ hincha (cualquier talla), cada una queda en $49.000",
  },
];

const formatPrice = (value: number) => `$${new Intl.NumberFormat("es-CO").format(value)} COP`;

const buildInitialSelectors = () =>
  PRODUCTS.reduce<SelectorState>((accumulator, product) => {
    accumulator[product.id] = {
      size: product.sizes[0],
      quantity: 1,
    };
    return accumulator;
  }, {});

function getEffectivePrice(item: CartItem, cart: CartItem[]): number {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) return item.unitPrice;

  const categoryUnits = cart
    .filter((ci) => {
      const p = PRODUCTS.find((pr) => pr.id === ci.productId);
      return p && p.category === product.category;
    })
    .reduce((sum, ci) => sum + ci.quantity, 0);

  return categoryUnits >= product.wholesaleMin ? product.wholesalePrice : product.price;
}

function ProductConfigurator({
  product,
  selector,
  onSizeChange,
  onQuantityChange,
  onAdd,
  onOpenSizeGuide,
  compact = false,
}: {
  product: Product;
  selector: { size: string; quantity: number };
  onSizeChange: (size: string) => void;
  onQuantityChange: (nextQuantity: number) => void;
  onAdd: () => void;
  onOpenSizeGuide: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`glass-card relative rounded-[1.6rem] border p-4 sm:p-5 ${compact ? "space-y-4" : "space-y-5"}`}
      style={{ boxShadow: `0 24px 70px color-mix(in oklab, ${product.accent} 10%, transparent)` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em]" style={{ color: product.accent }}>
            {product.badge}
          </p>
          <h3 className={`mt-2 font-bold text-foreground ${compact ? "text-lg" : "text-xl"}`}>
            {product.shortName}
          </h3>
        </div>
        <p className={`font-bold text-foreground ${compact ? "text-sm" : "text-base"}`}>
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.features.map((feature) => (
          <span key={feature} className="feature-chip" style={{ borderColor: product.accentSoft }}>
            {feature}
          </span>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Talla</p>
          <button type="button" className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[oklch(0.86_0.15_85)]" onClick={onOpenSizeGuide}>
            Guía de tallas
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className="size-pill"
              data-selected={selector.size === size}
              onClick={() => onSizeChange(size)}
              aria-label={`Seleccionar talla ${size} para ${product.shortName}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Cantidad</p>
          <div className="quantity-shell">
            <button type="button" aria-label={`Disminuir cantidad de ${product.shortName}`} onClick={() => onQuantityChange(Math.max(1, selector.quantity - 1))}>
              <Minus className="mx-auto h-4 w-4" />
            </button>
            <span>{selector.quantity}</span>
            <button type="button" aria-label={`Aumentar cantidad de ${product.shortName}`} onClick={() => onQuantityChange(selector.quantity + 1)}>
              <Plus className="mx-auto h-4 w-4" />
            </button>
          </div>
        </div>

        <Button
          type="button"
          className={`chrome-button h-12 px-6 font-bold ${compact ? "w-full sm:w-auto" : "w-full sm:min-w-[15rem]"}`}
          onClick={onAdd}
        >
          Agregar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CompactVariantCard({
  product,
  selector,
  onSizeChange,
  onQuantityChange,
  onAdd,
  onOpenSizeGuide,
}: {
  product: Product;
  selector: { size: string; quantity: number };
  onSizeChange: (size: string) => void;
  onQuantityChange: (nextQuantity: number) => void;
  onAdd: () => void;
  onOpenSizeGuide: () => void;
}) {
  return (
    <article
      className="glass-card rounded-[1.5rem] border p-4 sm:p-5"
      style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${product.accent} 12%, oklch(0.18 0.01 255 / 0.85)), oklch(0.1 0.01 255 / 0.95))` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.24em]" style={{ borderColor: product.accentSoft, color: product.accent }}>
            {product.badge}
          </div>
          <h3 className="text-lg font-bold text-foreground sm:text-xl">{product.shortName}</h3>
        </div>
        <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-white/58">Talla</p>
        <button type="button" className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[oklch(0.86_0.15_85)]" onClick={onOpenSizeGuide}>
          Guía
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.sizes.map((size) => (
          <button key={size} type="button" className="size-pill text-[0.72rem]" data-selected={selector.size === size} onClick={() => onSizeChange(size)}>
            {size}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="quantity-shell scale-[0.92] origin-left">
          <button type="button" onClick={() => onQuantityChange(Math.max(1, selector.quantity - 1))}>
            <Minus className="mx-auto h-4 w-4" />
          </button>
          <span>{selector.quantity}</span>
          <button type="button" onClick={() => onQuantityChange(selector.quantity + 1)}>
            <Plus className="mx-auto h-4 w-4" />
          </button>
        </div>
        <Button type="button" className="chrome-button h-11 flex-1 font-bold" onClick={onAdd}>
          Añadir
        </Button>
      </div>
    </article>
  );
}

function MobileImpulseCard({
  product,
  selector,
  gallery,
  activeIdx,
  onImageChange,
  onOpenPreview,
  onOpenSizeGuide,
  onSizeChange,
  onQuantityChange,
  onAdd,
}: {
  product: Product;
  selector: { size: string; quantity: number };
  gallery: Array<{ src: string; alt: string }>;
  activeIdx: number;
  onImageChange: (next: number) => void;
  onOpenPreview: (image: { src: string; alt: string }) => void;
  onOpenSizeGuide: () => void;
  onSizeChange: (size: string) => void;
  onQuantityChange: (nextQuantity: number) => void;
  onAdd: () => void;
}) {
  const activeImage = gallery[activeIdx] ?? gallery[0];
  return (
    <article className="mobile-impulse-card">
      <button type="button" className="mobile-impulse-art" onClick={() => onOpenPreview(activeImage)} aria-label={`Ver ${product.shortName} en grande`}>
        <img src={activeImage.src} alt={activeImage.alt} className="h-full w-full object-contain" loading="lazy" />
      </button>
      {gallery.length > 1 && (
        <div className="mobile-impulse-carousel">
          <button
            type="button"
            className="mobile-impulse-carousel-arrow"
            aria-label={`Imagen anterior de ${product.shortName}`}
            onClick={() => onImageChange(activeIdx === 0 ? gallery.length - 1 : activeIdx - 1)}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <div className="mobile-impulse-carousel-dots">
            {gallery.map((_, idx) => (
              <button
                key={`${product.id}-dot-${idx}`}
                type="button"
                className="mobile-impulse-carousel-dot"
                data-active={idx === activeIdx}
                aria-label={`Ver imagen ${idx + 1} de ${product.shortName}`}
                onClick={() => onImageChange(idx)}
              />
            ))}
          </div>
          <button
            type="button"
            className="mobile-impulse-carousel-arrow"
            aria-label={`Siguiente imagen de ${product.shortName}`}
            onClick={() => onImageChange((activeIdx + 1) % gallery.length)}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
      <p className="mobile-impulse-badge">{product.badge}</p>
      <h3>{product.shortName}</h3>
      <p className="mobile-impulse-price">{formatPrice(product.price)}</p>

      <select
        className="mobile-impulse-size"
        value={selector.size}
        onChange={(event) => onSizeChange(event.target.value)}
        aria-label={`Seleccionar talla de ${product.shortName}`}
      >
        {product.sizes.map((size) => (
          <option key={size} value={size}>
            Talla {size}
          </option>
        ))}
      </select>
      <button type="button" className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.1em] text-[oklch(0.86_0.15_85)]" onClick={onOpenSizeGuide}>
        Ver guía de tallas
      </button>

      <div className="mobile-impulse-actions">
        <div className="mobile-impulse-qty">
          <button type="button" onClick={() => onQuantityChange(Math.max(1, selector.quantity - 1))} aria-label={`Disminuir cantidad de ${product.shortName}`}>
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span>{selector.quantity}</span>
          <button type="button" onClick={() => onQuantityChange(selector.quantity + 1)} aria-label={`Aumentar cantidad de ${product.shortName}`}>
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button type="button" className="mobile-impulse-add" onClick={onAdd}>
          Añadir
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectors, setSelectors] = useState<SelectorState>(() => buildInitialSelectors());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "envio",
    city: "",
    neighborhood: "",
    address: "",
    reference: "",
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"gate" | "animating" | "done">("gate");
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [heroBackView, setHeroBackView] = useState<Record<string, boolean>>({});
  const [heroBackError, setHeroBackError] = useState<Record<string, boolean>>({});
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playerCaballero = PRODUCTS.find((product) => product.id === "player-caballero")!;
  const playerDama = PRODUCTS.find((product) => product.id === "player-dama")!;
  const playerNino = PRODUCTS.find((product) => product.id === "player-nino")!;
  const trainingWhite = PRODUCTS.find((product) => product.id === "training-white")!;
  const fanCaballero = PRODUCTS.find((product) => product.id === "fan-caballero")!;
  const fanDama = PRODUCTS.find((product) => product.id === "fan-dama")!;

  const PLAYER_GALLERY = useMemo(() => [
    { src: PLAYER_FRONT, alt: "Vista frontal", fit: "contain" as const },
    { src: PLAYER_BACK, alt: "Vista trasera", fit: "contain" as const },
    { src: PLAYER_BADGE, alt: "Detalle del escudo", fit: "cover" as const },
    { src: PLAYER_STRIPES, alt: "Detalle de las franjas", fit: "cover" as const },
  ], []);

  const TRAINING_GALLERY = useMemo(() => [
    { src: TRAINING_FRONT, alt: "Vista frontal", fit: "contain" as const },
    { src: TRAINING_BACK, alt: "Vista trasera", fit: "contain" as const },
    { src: TRAINING_BADGE, alt: "Detalle del escudo", fit: "cover" as const },
    { src: TRAINING_SLEEVE, alt: "Detalle de la manga", fit: "cover" as const },
  ], []);

  const FAN_CAB_GALLERY = useMemo(() => [
    { src: FAN_CAB_FRONT, alt: "Vista frontal", fit: "contain" as const },
    { src: FAN_CAB_BADGE, alt: "Detalle escudo", fit: "cover" as const },
    { src: FAN_DAMA_BADGE, alt: "Detalle bordado", fit: "cover" as const },
  ], []);

  const FAN_DAMA_GALLERY = useMemo(() => [
    { src: FAN_DAMA_FRONT, alt: "Vista frontal", fit: "contain" as const },
    { src: FAN_DAMA_SLEEVE, alt: "Detalle puño", fit: "cover" as const },
    { src: FAN_DAMA_BADGE, alt: "Detalle escudo", fit: "cover" as const },
  ], []);

  const [playerMainIdx, setPlayerMainIdx] = useState(0);
  const [trainingMainIdx, setTrainingMainIdx] = useState(0);
  const [fanCabMainIdx, setFanCabMainIdx] = useState(0);
  const [fanDamaMainIdx, setFanDamaMainIdx] = useState(0);
  const [mobilePlayerIdx, setMobilePlayerIdx] = useState(0);
  const [mobileTrainingIdx, setMobileTrainingIdx] = useState(0);
  const [mobileFanCabIdx, setMobileFanCabIdx] = useState(0);
  const [mobileFanDamaIdx, setMobileFanDamaIdx] = useState(0);
  const [imagePreview, setImagePreview] = useState<{ src: string; alt: string } | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const activeHeroSlide = HERO_JERSEY_SLIDES[heroSlideIdx];
  const activeHeroHasBack = !!activeHeroSlide.back;
  const activeHeroCanFlip = !!activeHeroSlide.back && !heroBackError[activeHeroSlide.id];
  const activeHeroIsBack = !!heroBackView[activeHeroSlide.id] && activeHeroCanFlip;

  const trackEvent = useCallback((event: string, data?: Record<string, unknown>) => {
    const maybeUmami = (window as unknown as { umami?: { track?: (name: string, payload?: Record<string, unknown>) => void } }).umami;
    if (typeof maybeUmami?.track === "function") {
      maybeUmami.track(event, data);
    }
  }, []);

  const handleTilt = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);

  const handleTiltReset = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobileViewport(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setHeroSlideIdx((current) => (current + 1) % HERO_JERSEY_SLIDES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setHeroBackView((current) => ({ ...current, [activeHeroSlide.id]: false }));
  }, [heroSlideIdx]);

  const totals = useMemo(() => {
    const units = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const total = cart.reduce((acc, item) => acc + item.quantity * getEffectivePrice(item, cart), 0);
    const discount = subtotal - total;

    return { units, subtotal, discount, total };
  }, [cart]);

  const customerErrors = useMemo(() => {
    const name = customer.name.trim().length >= 3 ? "" : "Escribe un nombre válido.";
    const phoneRegex = /^(\+57|57|0)?\s?3\d{2}\s?\d{3}\s?\d{4}$/;
    const phone = phoneRegex.test(customer.phone.trim()) ? "" : "Ingresa un celular colombiano válido.";
    const email = customer.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) ? "" : "Escribe un correo válido o déjalo vacío.";
    const city = customer.city.trim().length >= 2 ? "" : "Escribe la ciudad de entrega.";
    const neighborhood = customer.neighborhood.trim().length >= 2 ? "" : "Escribe el barrio/zona.";
    const address = customer.deliveryMethod === "envio" && customer.address.trim().length < 6 ? "Escribe una dirección completa." : "";
    const reference = customer.deliveryMethod === "envio" && customer.reference.trim().length < 4 ? "Agrega una referencia para ubicar mejor." : "";

    return { name, phone, email, city, neighborhood, address, reference };
  }, [customer]);

  const isCheckoutValid =
    cart.length > 0 &&
    !customerErrors.name &&
    !customerErrors.phone &&
    !customerErrors.email &&
    !customerErrors.city &&
    !customerErrors.neighborhood &&
    !customerErrors.address &&
    !customerErrors.reference;

  const whatsappMessage = useMemo(() => {
    const productLines = cart.map((item) => {
      const effective = getEffectivePrice(item, cart);
      const lineTotal = item.quantity * effective;
      const isWholesale = effective < item.unitPrice;
      return `- ${item.productName} · Talla ${item.size} x ${item.quantity} @ ${formatPrice(effective)}${isWholesale ? " (mayorista)" : ""} = ${formatPrice(lineTotal)}`;
    });

    const lines = [
      "PEDIDO LA GUACA | SELECCION COLOMBIA 2026",
      "",
      "================= TABLA PEDIDO =================",
      ...productLines.map((line, idx) => `${idx + 1}. ${line}`),
      "================================================",
      "",
      "RESUMEN COMERCIAL",
      `- Subtotal: ${formatPrice(totals.subtotal)}`,
      totals.discount > 0 ? `- Descuento mayorista: -${formatPrice(totals.discount)}` : "",
      `- Total final: ${formatPrice(totals.total)}`,
      "",
      "DATOS DE ENVIO",
      `- Metodo: ${customer.deliveryMethod === "envio" ? "Envio a domicilio" : "Retiro en tienda"}`,
      `- Ciudad: ${customer.city.trim()}`,
      `- Barrio/Zona: ${customer.neighborhood.trim()}`,
      customer.deliveryMethod === "envio" ? `- Direccion: ${customer.address.trim()}` : "- Direccion: Retiro en boutique",
      customer.deliveryMethod === "envio" ? `- Referencia: ${customer.reference.trim()}` : "- Referencia: N/A",
      "",
      "DATOS DEL CLIENTE",
      `- Nombre: ${customer.name.trim()}`,
      `- Celular: ${customer.phone.trim()}`,
      customer.email.trim() ? `- Correo: ${customer.email.trim()}` : "- Correo: No suministrado",
      "",
      "Pendiente por confirmar: medio de pago y validacion final.",
    ].filter(Boolean);

    return lines.join("\n");
  }, [cart, customer, totals]);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateSelector = (productId: string, patch: Partial<{ size: string; quantity: number }>) => {
    setSelectors((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        ...patch,
      },
    }));
  };

  const addToCart = (product: Product) => {
    const selected = selectors[product.id];
    setCart((current) => {
      const existingItem = current.find((item) => item.productId === product.id && item.size === selected.size);

      if (existingItem) {
        return current.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + selected.quantity } : item));
      }

      return [
        ...current,
        {
          id: `${product.id}-${selected.size}`,
          productId: product.id,
          productName: product.shortName,
          size: selected.size,
          quantity: selected.quantity,
          unitPrice: product.price,
          accent: product.accent,
        },
      ];
    });

    const pill = document.querySelector(".header-cart-pill");
    if (pill) {
      pill.classList.add("cart-pulse");
      setTimeout(() => pill.classList.remove("cart-pulse"), 600);
    }

    trackEvent("add_to_cart", {
      product: product.id,
      size: selected.size,
      quantity: selected.quantity,
      channel: "landing",
    });
  };

  const removeCartItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleSendOrder = () => {
    if (!isCheckoutValid) return;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    trackEvent("send_whatsapp_order", {
      units: totals.units,
      total: totals.total,
      deliveryMethod: customer.deliveryMethod,
      hasWholesale: totals.discount > 0,
    });

    setCheckoutOpen(false);
    setConfirmationOpen(true);
    setCart([]);
    setCustomer({
      name: "",
      phone: "",
      email: "",
      deliveryMethod: "envio",
      city: "",
      neighborhood: "",
      address: "",
      reference: "",
    });
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lowPerfMode = isMobileViewport || prefersReducedMotion;

      const applyTheme = (start: string, end: string, glow: string) => {
        gsap.to(document.documentElement, {
          "--page-bg-start": start,
          "--page-bg-end": end,
          "--page-glow": glow,
          duration: 1,
          ease: "power2.out",
        });
      };

      gsap.set("[data-hero='eyebrow']", { autoAlpha: 0, y: 18 });
      gsap.set("[data-hero='title']", { autoAlpha: 0, y: 42 });
      gsap.set("[data-hero='lead']", { autoAlpha: 0, y: 24 });
      gsap.set("[data-hero='actions']", { autoAlpha: 0, y: 26 });
      gsap.set("[data-hero='stats']", { autoAlpha: 0, y: 22 });
      gsap.set("[data-hero='stage']", { autoAlpha: 0, x: 34, scale: 0.96 });
      gsap.set("[data-hero='rail']", { autoAlpha: 0, y: 22 });
      gsap.set("[data-hero='scroll']", { autoAlpha: 0, y: 14 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to("[data-hero='eyebrow']", { autoAlpha: 1, y: 0, duration: 0.75 })
        .to("[data-hero='title']", { autoAlpha: 1, y: 0, duration: 0.95 }, "-=0.35")
        .to("[data-hero='lead']", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to("[data-hero='actions']", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to("[data-hero='stats']", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to("[data-hero='stage']", { autoAlpha: 1, x: 0, scale: 1, duration: 0.9 }, "-=0.75")
        .to("[data-hero='rail']", { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.45")
        .to("[data-hero='scroll']", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.4");

      gsap.to("[data-hero='bg']", {
        yPercent: 38,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.8,
        },
      });

      if (!lowPerfMode) {
        gsap.to("[data-stage-main]", {
          yPercent: -22,
          rotation: 2.5,
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero='section']",
            start: "top top",
            end: "bottom top",
            scrub: 1.8,
          },
        });

        gsap.to(".hero-stage-glow", {
          scale: 2.6,
          opacity: 0.72,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero='section']",
            start: "top top",
            end: "bottom top",
            scrub: 2.4,
          },
        });

        gsap.utils.toArray<HTMLElement>(".spotlight-ring").forEach((ring, i) => {
          gsap.to(ring, {
            y: i === 0 ? 90 : -60,
            x: i === 0 ? -50 : 40,
            scale: 1.5,
            opacity: 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero='section']",
              start: "top top",
              end: "bottom top",
              scrub: 2.8 + i * 0.4,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-card-float]").forEach((card, index) => {
          gsap.to(card, {
            y: index % 2 === 0 ? -10 : 10,
            duration: 2.8 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((element) => {
        const direction = element.dataset.animate ?? "up";
        const fromVars: gsap.TweenVars = { autoAlpha: 0 };

        if (direction === "left") fromVars.x = -48;
        if (direction === "right") fromVars.x = 48;
        if (direction === "scale") fromVars.scale = 0.94;
        if (direction === "up") fromVars.y = 28;

        gsap.fromTo(
          element,
          fromVars,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      if (!lowPerfMode) {
        gsap.utils.toArray<HTMLElement>("[data-sticky-product]").forEach((section) => {
          const image = section.querySelector<HTMLElement>("[data-product-image]");
          if (!image) return;

          gsap.fromTo(
            image,
            { y: 18, scale: 0.96 },
            {
              y: -20,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-theme-section]").forEach((section) => {
        const start = section.dataset.bgStart;
        const end = section.dataset.bgEnd;
        const glow = section.dataset.bgGlow;
        if (!start || !end || !glow) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          onEnter: () => applyTheme(start, end, glow),
          onEnterBack: () => applyTheme(start, end, glow),
        });
      });

      // Stadium digits reveal
      gsap.utils.toArray<HTMLElement>(".stadium-digit").forEach((digit) => {
        const delay = Number(digit.dataset.delay || 0) * 0.12;
        gsap.from(digit, {
          y: 60,
          opacity: 0,
          rotateX: -90,
          duration: 0.8,
          delay,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-stadium-content]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Stadium counter animation
      gsap.utils.toArray<HTMLElement>(".stadium-stat-number").forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            el.textContent = target > 9 ? `+${Math.round(obj.val)}` : String(Math.round(obj.val));
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (loadingPhase !== "animating" || !loadingRef.current) return;

    const playWhistle = () => {
      try {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(3400, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(3600, ctx.currentTime + 0.15);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(3800, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(3500, ctx.currentTime + 0.2);

        vibrato.type = "sine";
        vibrato.frequency.value = 30;
        vibratoGain.gain.value = 80;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc1.frequency);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        vibrato.start(ctx.currentTime);

        osc1.stop(ctx.currentTime + 0.85);
        osc2.stop(ctx.currentTime + 0.85);
        vibrato.stop(ctx.currentTime + 0.85);
      } catch { /* silent fallback */ }
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setLoadingPhase("done");
        audioCtxRef.current?.close();
      },
    });

    tl.set(".loader-beam", { opacity: 0, scaleY: 0 })
      .set(".loader-whistle", { opacity: 0, scale: 0.5 })
      .set(".loader-wave", { opacity: 0, scale: 0 })
      .set(".loader-countdown", { opacity: 0, scale: 2, y: 20 })
      .set(".loader-title", { opacity: 0, y: 30 })
      .set(".loader-subtitle", { opacity: 0 })

      .to(".loader-flash", { opacity: 1, duration: 0.3, ease: "power2.in" }, 0.2)
      .to(".loader-flash", { opacity: 0, duration: 0.5 }, 0.5)

      .to(".loader-beam", {
        opacity: 1,
        scaleY: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }, 0.4)

      .to(".loader-whistle", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      }, 1.0)

      .to(".loader-wave", {
        opacity: 0.5,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }, 1.3)
      .to(".loader-wave", {
        opacity: 0,
        scale: 2.5,
        duration: 1.0,
        stagger: 0.2,
        ease: "power1.out",
      }, 1.6)

      .call(playWhistle, [], 1.35)
      .to(".loader-whistle", { scale: 1.15, duration: 0.08, yoyo: true, repeat: 5 }, 1.4)

      .to(".loader-countdown", { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, 2.2)
      .to(".loader-countdown", { innerHTML: "2", duration: 0 }, 2.7)
      .to(".loader-countdown", { scale: 1.3, duration: 0.08 }, 2.7)
      .to(".loader-countdown", { scale: 1, duration: 0.2 }, 2.78)
      .to(".loader-countdown", { innerHTML: "1", duration: 0 }, 3.2)
      .to(".loader-countdown", { scale: 1.3, duration: 0.08 }, 3.2)
      .to(".loader-countdown", { scale: 1, duration: 0.2 }, 3.28)

      .to(".loader-countdown", { opacity: 0, scale: 3, duration: 0.4, ease: "power2.in" }, 3.6)

      .to(".loader-title", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 3.8)
      .to(".loader-subtitle", { opacity: 1, duration: 0.5 }, 4.1)

      .to(".loader-beam", {
        opacity: 0.9,
        scaleX: 3,
        duration: 0.8,
        ease: "power2.in",
      }, 4.4)

      .to(loadingRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      }, 4.8);

    return () => tl.kill();
  }, [loadingPhase]);

  return (
    <div ref={rootRef} className="relative min-h-screen">
      {/* ── Loading Screen ────────────────────────────────────────────────── */}
      {loadingPhase !== "done" && (
        <div ref={loadingRef} className="loader-overlay">
          {/* Gate: click to enter */}
          {loadingPhase === "gate" && (
            <button
              type="button"
              className="loader-gate"
              onClick={() => {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                setLoadingPhase("animating");
              }}
            >
              <div className="loader-gate-ring" />
              <div className="loader-gate-content">
                <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg" className="loader-gate-icon">
                  <circle cx="22" cy="32" r="14" fill="oklch(0.86 0.15 85)" opacity="0.9" />
                  <circle cx="22" cy="32" r="10" fill="oklch(0.92 0.1 85)" />
                  <rect x="34" y="28" width="22" height="8" rx="4" fill="oklch(0.86 0.15 85)" opacity="0.9" />
                  <rect x="34" y="30" width="22" height="4" rx="2" fill="oklch(0.92 0.1 85)" />
                  <circle cx="22" cy="32" r="4" fill="oklch(0.17 0.01 255)" />
                </svg>
                <span className="loader-gate-label">Toca para entrar</span>
              </div>
            </button>
          )}

          {/* Animation phase */}
          {loadingPhase === "animating" && (
            <>
              <div className="loader-flash" />
              <div className="loader-beam loader-beam--tl" />
              <div className="loader-beam loader-beam--tr" />
              <div className="loader-beam loader-beam--bl" />
              <div className="loader-beam loader-beam--br" />

              <div className="loader-whistle">
                <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="32" r="14" fill="oklch(0.86 0.15 85)" opacity="0.9" />
                  <circle cx="22" cy="32" r="10" fill="oklch(0.92 0.1 85)" />
                  <rect x="34" y="28" width="22" height="8" rx="4" fill="oklch(0.86 0.15 85)" opacity="0.9" />
                  <rect x="34" y="30" width="22" height="4" rx="2" fill="oklch(0.92 0.1 85)" />
                  <circle cx="22" cy="32" r="4" fill="oklch(0.17 0.01 255)" />
                  <path d="M18 18 L14 8" stroke="oklch(0.86 0.15 85)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                  <circle cx="14" cy="6" r="2.5" fill="oklch(0.86 0.15 85)" opacity="0.7" />
                </svg>
              </div>

              <div className="loader-wave loader-wave--1" />
              <div className="loader-wave loader-wave--2" />
              <div className="loader-wave loader-wave--3" />

              <div className="loader-countdown">3</div>

              <div className="loader-title">
                <span className="loader-title-col">COLOMBIA</span>
                <span className="loader-title-year">2026</span>
              </div>
              <div className="loader-subtitle">La Guaca — Selección Colombia</div>
            </>
          )}

          <div className="loader-tricolor">
            <div className="loader-tricolor-bar" style={{ background: "#FCD116" }} />
            <div className="loader-tricolor-bar" style={{ background: "#003893" }} />
            <div className="loader-tricolor-bar" style={{ background: "#CE1126" }} />
          </div>
        </div>
      )}

      {/* Jersey: fixed, recorre toda la página con parallax */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <img
          data-hero="bg"
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute -top-[15%] left-0 h-[130%] w-full object-cover object-center opacity-[0.32]"
          loading="eager"
        />
      </div>

      {/* Capa ambiental: glows + noise */}
      <div className="pointer-events-none fixed inset-0 z-[2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_oklch(0.86_0.15_85_/_0.08),_transparent_28%),radial-gradient(circle_at_80%_22%,_oklch(0.57_0.17_258_/_0.12),_transparent_24%)]" />
        <div className="noise-overlay" />
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <nav className="absolute inset-x-4 top-4 rounded-[1.8rem] border border-white/12 bg-[oklch(0.11_0.01_255_/_0.98)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,oklch(0.86_0.15_85),oklch(0.63_0.2_28))] text-xs font-black text-black">LG</span>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white/80">La Guaca</p>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/60 transition hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { label: "Colección", id: "coleccion" },
                { label: "Carrito", id: "carrito" },
                { label: "Contacto", id: "contacto" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[1.1rem] px-4 py-3.5 text-left text-base font-semibold text-white/75 transition hover:bg-white/6 hover:text-white"
                  onClick={() => { setMobileNavOpen(false); setTimeout(() => scrollToId(item.id), 100); }}
                >
                  {item.label}
                  <ArrowRight className="ml-auto h-4 w-4 opacity-40" />
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-4 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-full border border-white/10 bg-black/38 px-3 py-2.5 backdrop-blur-xl sm:px-4 lg:px-6">
          <button type="button" className="flex min-w-0 items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,oklch(0.86_0.15_85),oklch(0.63_0.2_28))] text-xs font-black text-black">
              LG
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate text-[0.72rem] font-black uppercase tracking-[0.24em] text-white/72 sm:text-sm">La Guaca</p>
              <p className="truncate text-[0.68rem] text-white/42 sm:text-xs">Selección Colombia 2026</p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 lg:flex">
            <a href="#coleccion" className="nav-link">Colección</a>
            <a href="#carrito" className="nav-link">Carrito</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="header-cart-pill"
              onClick={() => {
                trackEvent("click_header_cart");
                cart.length > 0 ? setCheckoutOpen(true) : scrollToId("carrito");
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{cart.length > 0 ? `${totals.units}` : "Carrito"}</span>
            </button>
            <Button type="button" className="chrome-button hidden h-11 px-5 text-sm font-extrabold sm:inline-flex" onClick={() => scrollToId("coleccion")}>
              Explorar
            </Button>
            <button
              type="button"
              aria-label="Abrir menú de navegación"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/80 transition hover:bg-white/12 hover:text-white lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-28 lg:pb-20">
        <section
          data-hero="section"
          className="relative overflow-hidden pt-24 sm:pt-28"
          data-theme-section
          data-bg-start="oklch(0.18 0.01 265)"
          data-bg-end="oklch(0.08 0.01 255)"
          data-bg-glow="oklch(0.86 0.15 85 / 0.12)"
        >
          {/* Gradiente de oscurecimiento local del hero */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.22),rgba(8,9,12,0.68)_55%,rgba(8,9,12,0.96))]" />

          <div className="spotlight-ring -left-24 top-12" />
          <div className="spotlight-ring bottom-12 right-[-4rem]" style={{ background: "radial-gradient(circle, oklch(0.57 0.17 258 / 0.2), transparent 68%)" }} />

          <div className="container relative py-8 sm:py-10 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.92fr)] lg:items-center">
              <div className="max-w-3xl" data-hero="content">
                <div data-hero="eyebrow" className="eyebrow">
                  <span className="eyebrow-dot" />
                  Boutique premium · Montería · drop 2026
                </div>

                <h1 data-hero="title" className="display-title mt-6 max-w-3xl text-[3.1rem] text-white sm:text-[4.6rem] lg:text-[6rem]">
                  La Tricolor, en modo colección.
                </h1>

                <p data-hero="lead" className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                  Diseñada para destacar: siluetas player, training y hincha en una compra directa, rápida y sin fricción.
                </p>

                <div data-hero="actions" className="mt-7">
                  <Button
                    type="button"
                    className="chrome-button h-13 px-6 text-sm font-extrabold uppercase tracking-[0.16em]"
                    onClick={() => {
                      trackEvent("click_cta_hero_collection");
                      scrollToId("coleccion");
                    }}
                  >
                    Ver colección
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[oklch(0.86_0.15_85)]/90">
                  Drop activo hoy · stock limitado por talla
                </p>

                <div data-hero="stats" className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
                  {HERO_STATS.map((stat) => (
                    <div key={stat.label} className="metric-chip px-3 py-3 sm:px-4 sm:py-4">
                      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-white/42 sm:text-[0.68rem]">{stat.label}</p>
                      <p className="mt-2 text-base font-black text-white sm:text-xl">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div data-hero="stage" className="hero-stage">
                <div className="hero-stage-grid">
                  <div className="hero-plaque hero-plaque-top" data-card-float>
                    <span className="hero-plaque-label">{activeHeroSlide.label}</span>
                    <strong>{activeHeroSlide.title}</strong>
                    <small>{activeHeroSlide.note}</small>
                  </div>

                  <div className="hero-stage-main">
                    <div className="hero-stage-glow" />
                    <div className="hero-carousel-shell" data-stage-main>
                      {isMobileViewport ? (
                        <img
                          key={`${activeHeroSlide.id}-${activeHeroIsBack ? "back" : "front"}-mobile`}
                          src={activeHeroIsBack && activeHeroSlide.back ? activeHeroSlide.back : activeHeroSlide.front}
                          alt={`${activeHeroSlide.label} ${activeHeroIsBack ? "vista trasera" : "vista frontal"}`}
                          className="hero-stage-image"
                          loading="eager"
                          onError={() => setHeroBackError((current) => ({ ...current, [activeHeroSlide.id]: true }))}
                        />
                      ) : (
                        <div className={`hero-carousel-flip ${activeHeroIsBack ? "is-back" : ""}`}>
                          <div className="hero-carousel-face hero-carousel-face--front">
                            <img
                              key={`${activeHeroSlide.id}-front`}
                              src={activeHeroSlide.front}
                              alt={`${activeHeroSlide.label} vista frontal`}
                              className="hero-stage-image"
                              loading="eager"
                            />
                          </div>
                          <div className="hero-carousel-face hero-carousel-face--back">
                            <img
                              key={`${activeHeroSlide.id}-back`}
                              src={activeHeroSlide.back ?? activeHeroSlide.front}
                              alt={`${activeHeroSlide.label} vista trasera`}
                              className="hero-stage-image"
                              loading="eager"
                              onError={() => setHeroBackError((current) => ({ ...current, [activeHeroSlide.id]: true }))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="hero-carousel-ui">
                      <button
                        type="button"
                        className="hero-carousel-arrow"
                        aria-label="Camiseta anterior"
                        onClick={() =>
                          setHeroSlideIdx((current) =>
                            current === 0 ? HERO_JERSEY_SLIDES.length - 1 : current - 1,
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="hero-carousel-dots">
                        {HERO_JERSEY_SLIDES.map((slide, idx) => (
                          <button
                            key={slide.id}
                            type="button"
                            aria-label={`Mostrar ${slide.label}`}
                            className="hero-carousel-dot"
                            data-active={idx === heroSlideIdx}
                            style={{ ["--dot-accent" as string]: slide.accent }}
                            onClick={() => setHeroSlideIdx(idx)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="hero-carousel-arrow"
                        aria-label="Siguiente camiseta"
                        onClick={() => setHeroSlideIdx((current) => (current + 1) % HERO_JERSEY_SLIDES.length)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="hero-flip-trigger"
                      onClick={() =>
                        activeHeroCanFlip &&
                        setHeroBackView((current) => ({ ...current, [activeHeroSlide.id]: !current[activeHeroSlide.id] }))
                      }
                      disabled={!activeHeroCanFlip}
                    >
                      {!activeHeroHasBack ? "Vista unica" : activeHeroCanFlip ? (activeHeroIsBack ? "Ver frente" : "Ver espalda") : "Vista no disponible"}
                    </button>
                  </div>

                  <div className="hero-plaque hero-plaque-side" data-card-float>
                    <span className="hero-plaque-label">{activeHeroSlide.sideLabel}</span>
                    <strong>{activeHeroSlide.sideTitle}</strong>
                    <small>{activeHeroSlide.sideNote}</small>
                  </div>

                  <div className="hero-specs" data-card-float>
                    {activeHeroSlide.specs.map((spec) => (
                      <span key={spec} className="hero-spec">{spec}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div data-hero="rail" className="scene-rail mt-8 lg:mt-10">
              {HERO_SCENES.map((scene) => (
                <button key={scene.id} type="button" className="scene-card" onClick={() => scrollToId(scene.id)}>
                  <div className="scene-card-art">
                    <img src={scene.image} alt={scene.title} className="h-full w-full object-cover object-center opacity-82" loading="lazy" />
                  </div>
                  <div className="scene-card-copy">
                    <span className="scene-card-label" style={{ color: scene.accent }}>{scene.label}</span>
                    <strong>{scene.title}</strong>
                    <small>{scene.note}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div data-hero="scroll" className="absolute inset-x-0 bottom-4 z-10 hidden justify-center sm:flex">
            <button type="button" className="flex flex-col items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/54" onClick={() => scrollToId("coleccion")}>
              Scroll para descubrir
              <ChevronDown className="h-4 w-4 animate-bounce text-[oklch(0.86_0.15_85)]" />
            </button>
          </div>
        </section>

        {/* ── Social proof strip ─────────────────────────────────────────── */}
        <div className="container hidden py-4 lg:block" data-animate="up">
          <div className="social-proof-strip">
            <div className="social-proof-item">
              <span className="social-proof-number">+280</span>
              <span className="social-proof-label">pedidos confirmados</span>
            </div>
            <div className="social-proof-divider" />
            <div className="social-proof-item">
              <Zap className="h-4 w-4 text-[oklch(0.86_0.15_85)]" />
              <span className="social-proof-label">Checkout en 2 min por WhatsApp</span>
            </div>
            <div className="social-proof-divider" />
            <div className="social-proof-item">
              <span className="social-proof-number">6</span>
              <span className="social-proof-label">variantes · 1 drop</span>
            </div>
            <div className="social-proof-divider hidden sm:block" />
            <div className="social-proof-item hidden sm:flex">
              <Star className="h-4 w-4 text-[oklch(0.86_0.15_85)]" />
              <span className="social-proof-label">Boutique exclusiva Montería</span>
            </div>
          </div>
        </div>

        {/* ── Stadium Experience ────────────────────────────────────────────── */}
        <div className="container hidden py-6 lg:py-10 lg:block">
          <div className="stadium-experience section-shell relative overflow-hidden rounded-[2rem] border border-white/[0.08]">
            {/* Floodlight beams */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="stadium-beam stadium-beam--left" />
              <div className="stadium-beam stadium-beam--right" />
              <div className="stadium-beam stadium-beam--center" />
            </div>

            {/* Tricolor line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] flex">
              <div className="flex-1 bg-[#FCD116]" />
              <div className="flex-1 bg-[#003893]" />
              <div className="flex-1 bg-[#CE1126]" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-20 lg:py-28" data-stadium-content>
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.35em] text-[oklch(0.86_0.15_85)] sm:text-[0.68rem]">
                Selección Colombia
              </p>

              <h2 className="stadium-year mt-3 select-none text-center font-display text-[5rem] font-black leading-none tracking-tight text-white sm:text-[7rem] lg:text-[10rem]">
                <span className="stadium-digit" data-delay="0">2</span>
                <span className="stadium-digit" data-delay="1">0</span>
                <span className="stadium-digit" data-delay="2">2</span>
                <span className="stadium-digit" data-delay="3">6</span>
              </h2>

              <div className="mt-4 flex items-center gap-3 sm:mt-6">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/30 sm:w-14" />
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50 sm:text-[0.68rem]">
                  FIFA World Cup
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/30 sm:w-14" />
              </div>

              <div className="stadium-stats mt-10 grid w-full max-w-2xl grid-cols-3 gap-4 sm:mt-14 sm:gap-6">
                <div className="stadium-stat" data-animate="up">
                  <span className="stadium-stat-number" data-count="6">0</span>
                  <span className="stadium-stat-label">Versiones</span>
                </div>
                <div className="stadium-stat" data-animate="up">
                  <span className="stadium-stat-number" data-count="280">0</span>
                  <span className="stadium-stat-label">Pedidos</span>
                </div>
                <div className="stadium-stat" data-animate="up">
                  <span className="stadium-stat-number" data-count="1">0</span>
                  <span className="stadium-stat-label">Drop exclusivo</span>
                </div>
              </div>
            </div>

            {/* Bottom tricolor */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
              <div className="flex-1 bg-[#FCD116]" />
              <div className="flex-1 bg-[#003893]" />
              <div className="flex-1 bg-[#CE1126]" />
            </div>
          </div>
        </div>

        <section id="coleccion-desktop" className="container hidden pt-8 lg:block lg:pt-14" data-theme-section data-bg-start="oklch(0.17 0.01 255)" data-bg-end="oklch(0.095 0.012 255)" data-bg-glow="oklch(0.57 0.17 258 / 0.12)">
          <div data-animate="up" className="section-shell px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.86_0.15_85)]">Colección editada</p>
                <h2 className="display-title mt-3 text-[2.2rem] text-white sm:text-[3rem] lg:text-[4rem]">Tres lecturas. Un solo drop.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/62 sm:text-base">Más selección visual, menos bloque de texto. Entra por la silueta que más te guste.</p>
            </div>

            <div className="story-grid mt-6 lg:mt-8">
              {STORY_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="story-card" data-animate="up">
                    <div className="story-card-icon" style={{ color: card.accent }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/62">{card.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <CompactVariantCard product={playerDama} selector={selectors[playerDama.id]} onSizeChange={(size) => updateSelector(playerDama.id, { size })} onQuantityChange={(quantity) => updateSelector(playerDama.id, { quantity })} onAdd={() => addToCart(playerDama)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
              <CompactVariantCard product={playerNino} selector={selectors[playerNino.id]} onSizeChange={(size) => updateSelector(playerNino.id, { size })} onQuantityChange={(quantity) => updateSelector(playerNino.id, { quantity })} onAdd={() => addToCart(playerNino)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
            </div>
          </div>
        </section>

        <section className="container py-8 lg:py-12">
          <div className="section-grid gap-8 lg:gap-10">
            <div className="space-y-6 lg:space-y-8">
              <section id="coleccion" className="mobile-impulse-shell section-shell p-3 lg:hidden">
                <div className="mb-3">
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-[oklch(0.86_0.15_85)]">Compra rápida</p>
                  <h2 className="mt-1 text-xl font-black text-white">Elige y agrega en segundos</h2>
                </div>

                <div className="mobile-impulse-group">
                  <p className="mobile-impulse-group-title">Player + Training</p>
                  <div className="mobile-impulse-grid">
                    <MobileImpulseCard
                      product={playerCaballero}
                      selector={selectors[playerCaballero.id]}
                      gallery={PLAYER_GALLERY.map((item) => ({ src: item.src, alt: item.alt }))}
                      activeIdx={mobilePlayerIdx}
                      onImageChange={setMobilePlayerIdx}
                      onOpenPreview={setImagePreview}
                      onOpenSizeGuide={() => setSizeGuideOpen(true)}
                      onSizeChange={(size) => updateSelector(playerCaballero.id, { size })}
                      onQuantityChange={(quantity) => updateSelector(playerCaballero.id, { quantity })}
                      onAdd={() => addToCart(playerCaballero)}
                    />
                    <MobileImpulseCard
                      product={trainingWhite}
                      selector={selectors[trainingWhite.id]}
                      gallery={TRAINING_GALLERY.map((item) => ({ src: item.src, alt: item.alt }))}
                      activeIdx={mobileTrainingIdx}
                      onImageChange={setMobileTrainingIdx}
                      onOpenPreview={setImagePreview}
                      onOpenSizeGuide={() => setSizeGuideOpen(true)}
                      onSizeChange={(size) => updateSelector(trainingWhite.id, { size })}
                      onQuantityChange={(quantity) => updateSelector(trainingWhite.id, { quantity })}
                      onAdd={() => addToCart(trainingWhite)}
                    />
                  </div>
                </div>

                <div className="mobile-impulse-group">
                  <p className="mobile-impulse-group-title">Hincha + Hincha</p>
                  <div className="mobile-impulse-grid">
                    <MobileImpulseCard
                      product={fanCaballero}
                      selector={selectors[fanCaballero.id]}
                      gallery={FAN_CAB_GALLERY.map((item) => ({ src: item.src, alt: item.alt }))}
                      activeIdx={mobileFanCabIdx}
                      onImageChange={setMobileFanCabIdx}
                      onOpenPreview={setImagePreview}
                      onOpenSizeGuide={() => setSizeGuideOpen(true)}
                      onSizeChange={(size) => updateSelector(fanCaballero.id, { size })}
                      onQuantityChange={(quantity) => updateSelector(fanCaballero.id, { quantity })}
                      onAdd={() => addToCart(fanCaballero)}
                    />
                    <MobileImpulseCard
                      product={fanDama}
                      selector={selectors[fanDama.id]}
                      gallery={FAN_DAMA_GALLERY.map((item) => ({ src: item.src, alt: item.alt }))}
                      activeIdx={mobileFanDamaIdx}
                      onImageChange={setMobileFanDamaIdx}
                      onOpenPreview={setImagePreview}
                      onOpenSizeGuide={() => setSizeGuideOpen(true)}
                      onSizeChange={(size) => updateSelector(fanDama.id, { size })}
                      onQuantityChange={(quantity) => updateSelector(fanDama.id, { quantity })}
                      onAdd={() => addToCart(fanDama)}
                    />
                  </div>
                </div>
              </section>

              <article id="player-section" className="section-shell hidden p-4 sm:p-6 lg:block lg:p-10" data-sticky-product data-theme-section data-bg-start="oklch(0.16 0.01 255)" data-bg-end="oklch(0.09 0.012 255)" data-bg-glow="oklch(0.86 0.15 85 / 0.16)">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-8">
                  <div className="space-y-3">
                    <div
                      data-product-image
                      className="product-frame product-tilt relative flex min-h-[22rem] items-center justify-center overflow-hidden p-4 sm:min-h-[26rem] sm:p-8 lg:min-h-[32rem]"
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltReset}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.22_0.01_255),_oklch(0.09_0.01_255))]" />
                      <img
                        src={PLAYER_GALLERY[playerMainIdx].src}
                        alt={PLAYER_GALLERY[playerMainIdx].alt}
                        className={`gallery-main-img relative z-10 drop-shadow-[0_30px_100px_rgba(0,0,0,0.65)] ${PLAYER_GALLERY[playerMainIdx].fit === "contain" ? "max-h-[24rem] object-contain sm:max-h-[30rem] lg:max-h-[34rem]" : "h-full w-full object-cover"}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {PLAYER_GALLERY.filter((_, i) => i !== playerMainIdx).map((img, i) => (
                        <button
                          key={img.src}
                          className={`product-thumb cursor-pointer ${img.fit === "contain" ? "flex items-center justify-center p-3" : ""}`}
                          onClick={() => setPlayerMainIdx(PLAYER_GALLERY.indexOf(img))}
                          aria-label={`Ver ${img.alt}`}
                        >
                          <img src={img.src} alt={img.alt} className={`h-full w-full ${img.fit === "contain" ? "object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" : "object-cover object-center"}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5 lg:pr-2">
                    <div data-animate="right">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.86_0.15_85)]">Drop 01 · player</p>
                      <h2 className="display-title mt-3 text-[2.2rem] text-white sm:text-[3rem] lg:text-[4.2rem]">La pieza que manda.</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">Más ajuste, más brillo, más presencia. La silueta para abrir el drop con autoridad.</p>
                    </div>

                    <div className="compact-feature-grid" data-animate="up">
                      {playerCaballero.features.map((feature) => (
                        <div key={feature} className="detail-pill">
                          <CheckCircle2 className="h-4 w-4 text-[oklch(0.86_0.15_85)]" />
                          <span className="text-sm text-white/76">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3" data-animate="up">
                      <div className="micro-editorial-card">
                        <div className="micro-editorial-art">
                          <img src={PLAYER_BADGE} alt="Escudo de la Federación Colombiana" className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <p className="micro-editorial-label">Escudo</p>
                          <strong>Bordado premium de la FCF.</strong>
                        </div>
                      </div>
                      <div className="micro-editorial-card">
                        <div className="micro-editorial-art flex items-center justify-center p-1">
                          <img src={PLAYER_STRIPES} alt="Detalle de las franjas en el hombro" className="h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" loading="lazy" />
                        </div>
                        <div>
                          <p className="micro-editorial-label">Detalle</p>
                          <strong>Franjas tricolor en el hombro.</strong>
                        </div>
                      </div>
                    </div>

                    <ProductConfigurator product={playerCaballero} selector={selectors[playerCaballero.id]} onSizeChange={(size) => updateSelector(playerCaballero.id, { size })} onQuantityChange={(quantity) => updateSelector(playerCaballero.id, { quantity })} onAdd={() => addToCart(playerCaballero)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
                  </div>
                </div>
              </article>

              {/* Drop interlude */}
              <div className="drop-interlude hidden lg:block" data-animate="up">
                <span className="drop-interlude-label">Drop 02</span>
                <h2 className="drop-interlude-title">Training</h2>
                <p className="drop-interlude-sub">Un cambio de temperatura. Más limpio, más frío, más técnico.</p>
              </div>

              <article id="training-section" className="section-shell hidden p-4 sm:p-6 lg:block lg:p-10" data-sticky-product data-theme-section data-bg-start="oklch(0.18 0.015 255)" data-bg-end="oklch(0.11 0.018 250)" data-bg-glow="oklch(0.57 0.17 258 / 0.16)">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-8">
                  <div className="space-y-5 lg:order-1">
                    <div data-animate="left">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.57_0.17_258)]">Drop 02 · training</p>
                      <h2 className="display-title mt-3 text-[2.2rem] text-white sm:text-[3rem] lg:text-[4.2rem]">Fría. limpia. técnica.</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">Un cambio de temperatura visual para quien quiere una lectura más sobria y futurista.</p>
                    </div>

                    <div className="compact-feature-grid" data-animate="up">
                      {trainingWhite.features.map((feature) => (
                        <div key={feature} className="detail-pill">
                          <Sparkles className="h-4 w-4 text-[oklch(0.57_0.17_258)]" />
                          <span className="text-sm text-white/76">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3" data-animate="up">
                      <div className="micro-editorial-card">
                        <div className="micro-editorial-art">
                          <img src={TRAINING_BADGE} alt="Escudo FCF sobre tela blanca técnica" className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <p className="micro-editorial-label" style={{ color: "oklch(0.57 0.17 258)" }}>Escudo</p>
                          <strong>FCF sobre tela técnica blanca.</strong>
                        </div>
                      </div>
                      <div className="micro-editorial-card">
                        <div className="micro-editorial-art flex items-center justify-center p-1">
                          <img src={TRAINING_SLEEVE} alt="Detalle manga azul tricolor" className="h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" loading="lazy" />
                        </div>
                        <div>
                          <p className="micro-editorial-label" style={{ color: "oklch(0.57 0.17 258)" }}>Manga</p>
                          <strong>Azul tricolor con corte técnico.</strong>
                        </div>
                      </div>
                    </div>

                    <ProductConfigurator product={trainingWhite} selector={selectors[trainingWhite.id]} onSizeChange={(size) => updateSelector(trainingWhite.id, { size })} onQuantityChange={(quantity) => updateSelector(trainingWhite.id, { quantity })} onAdd={() => addToCart(trainingWhite)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
                  </div>

                  <div className="space-y-3 lg:order-2">
                    <div
                      data-product-image
                      className="product-frame product-tilt relative flex min-h-[22rem] items-center justify-center overflow-hidden p-4 sm:min-h-[26rem] sm:p-8 lg:min-h-[32rem]"
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltReset}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.22_0.01_255),_oklch(0.09_0.01_255))]" />
                      <img
                        src={TRAINING_GALLERY[trainingMainIdx].src}
                        alt={TRAINING_GALLERY[trainingMainIdx].alt}
                        className={`gallery-main-img relative z-10 drop-shadow-[0_30px_100px_rgba(0,0,0,0.65)] ${TRAINING_GALLERY[trainingMainIdx].fit === "contain" ? "max-h-[24rem] object-contain sm:max-h-[30rem] lg:max-h-[34rem]" : "h-full w-full object-cover"}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {TRAINING_GALLERY.filter((_, i) => i !== trainingMainIdx).map((img) => (
                        <button
                          key={img.src}
                          className={`product-thumb cursor-pointer ${img.fit === "contain" ? "flex items-center justify-center p-3" : ""}`}
                          onClick={() => setTrainingMainIdx(TRAINING_GALLERY.indexOf(img))}
                          aria-label={`Ver ${img.alt}`}
                        >
                          <img src={img.src} alt={img.alt} className={`h-full w-full ${img.fit === "contain" ? "object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" : "object-cover object-center"}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* Drop interlude */}
              <div className="drop-interlude hidden lg:block" data-animate="up" style={{ "--interlude-accent": "oklch(0.63 0.2 28)" } as React.CSSProperties}>
                <span className="drop-interlude-label" style={{ color: "oklch(0.63 0.2 28)" }}>Drop 03</span>
                <h2 className="drop-interlude-title">Hincha</h2>
                <p className="drop-interlude-sub">La versión más urbana del drop. Para la tribuna y la calle.</p>
              </div>

              <article id="fan-section" className="section-shell hidden overflow-hidden p-4 sm:p-6 lg:block lg:p-10" data-sticky-product data-theme-section data-bg-start="oklch(0.17 0.012 255)" data-bg-end="oklch(0.095 0.012 255)" data-bg-glow="oklch(0.63 0.2 28 / 0.16)">
                <div className="mb-8" data-animate="up">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.63_0.2_28)]">Drop 03 · hincha</p>
                  <h2 className="display-title mt-3 text-[2.2rem] text-white sm:text-[3rem] lg:text-[4rem]">La calle también juega.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">La versión más cómoda del drop, con energía urbana y lectura premium.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {/* Fan Caballero */}
                  <div className="space-y-3" data-animate="left">
                    <div
                      data-product-image
                      className="product-frame product-tilt relative flex min-h-[20rem] items-center justify-center overflow-hidden p-4 sm:min-h-[24rem] sm:p-8 lg:min-h-[28rem]"
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltReset}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.22_0.01_255),_oklch(0.09_0.01_255))]" />
                      <img
                        src={FAN_CAB_GALLERY[fanCabMainIdx].src}
                        alt={FAN_CAB_GALLERY[fanCabMainIdx].alt}
                        className={`gallery-main-img relative z-10 drop-shadow-[0_30px_100px_rgba(0,0,0,0.65)] ${FAN_CAB_GALLERY[fanCabMainIdx].fit === "contain" ? "max-h-[20rem] object-contain sm:max-h-[24rem] lg:max-h-[28rem]" : "h-full w-full object-cover"}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {FAN_CAB_GALLERY.filter((_, i) => i !== fanCabMainIdx).map((img) => (
                        <button
                          key={img.src}
                          className={`product-thumb cursor-pointer ${img.fit === "contain" ? "flex items-center justify-center p-3" : ""}`}
                          onClick={() => setFanCabMainIdx(FAN_CAB_GALLERY.indexOf(img))}
                          aria-label={`Ver ${img.alt}`}
                        >
                          <img src={img.src} alt={img.alt} className={`h-full w-full ${img.fit === "contain" ? "object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" : "object-cover object-center"}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                    <CompactVariantCard product={fanCaballero} selector={selectors[fanCaballero.id]} onSizeChange={(size) => updateSelector(fanCaballero.id, { size })} onQuantityChange={(quantity) => updateSelector(fanCaballero.id, { quantity })} onAdd={() => addToCart(fanCaballero)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
                  </div>

                  {/* Fan Dama */}
                  <div className="space-y-3" data-animate="right">
                    <div
                      data-product-image
                      className="product-frame product-tilt relative flex min-h-[20rem] items-center justify-center overflow-hidden p-4 sm:min-h-[24rem] sm:p-8 lg:min-h-[28rem]"
                      onMouseMove={handleTilt}
                      onMouseLeave={handleTiltReset}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.22_0.01_255),_oklch(0.09_0.01_255))]" />
                      <img
                        src={FAN_DAMA_GALLERY[fanDamaMainIdx].src}
                        alt={FAN_DAMA_GALLERY[fanDamaMainIdx].alt}
                        className={`gallery-main-img relative z-10 drop-shadow-[0_30px_100px_rgba(0,0,0,0.65)] ${FAN_DAMA_GALLERY[fanDamaMainIdx].fit === "contain" ? "max-h-[20rem] object-contain sm:max-h-[24rem] lg:max-h-[28rem]" : "h-full w-full object-cover"}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {FAN_DAMA_GALLERY.filter((_, i) => i !== fanDamaMainIdx).map((img) => (
                        <button
                          key={img.src}
                          className={`product-thumb cursor-pointer ${img.fit === "contain" ? "flex items-center justify-center p-3" : ""}`}
                          onClick={() => setFanDamaMainIdx(FAN_DAMA_GALLERY.indexOf(img))}
                          aria-label={`Ver ${img.alt}`}
                        >
                          <img src={img.src} alt={img.alt} className={`h-full w-full ${img.fit === "contain" ? "object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" : "object-cover object-center"}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                    <CompactVariantCard product={fanDama} selector={selectors[fanDama.id]} onSizeChange={(size) => updateSelector(fanDama.id, { size })} onQuantityChange={(quantity) => updateSelector(fanDama.id, { quantity })} onAdd={() => addToCart(fanDama)} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
                  </div>
                </div>
              </article>

              <section className="section-shell relative overflow-hidden p-4 sm:p-6 lg:p-10" data-theme-section data-bg-start="oklch(0.16 0.012 255)" data-bg-end="oklch(0.09 0.012 255)" data-bg-glow="oklch(0.86 0.15 85 / 0.14)">
                <div className="absolute inset-0 opacity-26">
                  <img src={FABRIC_IMAGE} alt="Detalle de la tela técnica de la colección" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.22),rgba(8,9,12,0.9))]" />
                </div>

                <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center">
                  <div data-animate="up">
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.86_0.15_85)]">Precios por volumen</p>
                    <h2 className="display-title mt-3 text-[2.1rem] text-white sm:text-[3rem] lg:text-[4rem]">El precio baja con el volumen.</h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">Dos niveles de precio según la versión y la cantidad. Sin pasos extra, sin códigos.</p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHOLESALE_WHATSAPP_TEXT)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chrome-button mt-5 inline-flex h-11 items-center justify-center px-5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em]"
                      onClick={() => trackEvent("click_cta_wholesale_whatsapp")}
                    >
                      Mayorista por WhatsApp
                    </a>
                  </div>

                  <div className="tier-grid" data-animate="scale">
                    {WHOLESALE_TIERS.map((tier) => {
                      const savings = Math.round(((tier.unitPrice - tier.wholesalePrice) / tier.unitPrice) * 100);
                      return (
                        <div
                          key={tier.label}
                          className="tier-card glass-card relative rounded-[1.35rem] border px-5 py-6"
                          style={{ borderColor: tier.accent.replace(")", " / 0.18)") }}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em]" style={{ color: tier.accent }}>{tier.label}</p>
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-wider"
                              style={{ background: tier.accent.replace(")", " / 0.15)"), color: tier.accent }}
                            >
                              -{savings}%
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-white/48">{tier.detail}</p>
                          <div className="mt-4 flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[0.6rem] font-bold uppercase tracking-wider text-white/40">Unitario</p>
                              <p className="mt-0.5 text-sm font-bold text-white/45 line-through">{formatPrice(tier.unitPrice)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em]" style={{ color: tier.accent }}>{tier.min}</p>
                              <p className="mt-0.5 text-2xl font-black text-white">{formatPrice(tier.wholesalePrice)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative z-10 mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-[oklch(0.14_0.01_255_/_0.65)] p-4">
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.2em] text-[oklch(0.86_0.15_85)]">Comparador rápido</p>
                    <div className="mt-3 space-y-2">
                      {PRODUCT_COMPARISON.map((item) => (
                        <div key={item.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-white">{item.label}</p>
                          <p className="mt-1 text-xs text-white/68">Fit: {item.fit}</p>
                          <p className="text-xs text-white/68">Ideal: {item.ideal}</p>
                          <p className="mt-1 text-xs font-bold text-[oklch(0.86_0.15_85)]">{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-white/10 bg-[oklch(0.14_0.01_255_/_0.65)] p-4">
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.2em] text-[oklch(0.57_0.17_258)]">Prueba social</p>
                    <div className="mt-3 space-y-2">
                      {QUICK_TESTIMONIALS.map((item) => (
                        <div key={item.author} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                          <p className="text-sm leading-6 text-white/80">“{item.quote}”</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/56">{item.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section id="contacto" className="section-shell p-4 sm:p-6 lg:p-10" data-theme-section data-bg-start="oklch(0.17 0.012 255)" data-bg-end="oklch(0.09 0.012 255)" data-bg-glow="oklch(0.57 0.17 258 / 0.14)">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
                  <div>
                    <div data-animate="up">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[oklch(0.57_0.17_258)]">Contacto</p>
                      <h2 className="display-title mt-3 text-[2.1rem] text-white sm:text-[3rem] lg:text-[4rem]">Dónde seguir y dónde comprar.</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">Instagram y ubicación de la boutique en Montería.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="glass-card rounded-[1.4rem] border p-4 sm:p-5" data-animate="right">
                        <div className="flex items-start gap-4">
                          <Instagram className="mt-1 h-5 w-5 text-[oklch(0.63_0.2_28)]" />
                          <div>
                            <p className="font-bold text-white">Instagram</p>
                            <p className="mt-1 text-sm text-white/65">@boutiquelaguaca1</p>
                            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-bold text-[oklch(0.63_0.2_28)]">
                              Ver perfil <ArrowUpRight className="ml-2 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card rounded-[1.4rem] border p-4 sm:p-5" data-animate="right">
                        <div className="flex items-start gap-4">
                          <LocateFixed className="mt-1 h-5 w-5 text-[oklch(0.57_0.17_258)]" />
                          <div>
                            <p className="font-bold text-white">Boutique La Guaca</p>
                            <p className="mt-1 text-sm leading-6 text-white/65">Calle 37 #1w-139, Barrio Juan XXIII, Montería.</p>
                            <a href="https://maps.google.com/?q=Calle+37+%231w-139+Monter%C3%ADa" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-bold text-[oklch(0.57_0.17_258)]">
                              Abrir en Maps <ArrowUpRight className="ml-2 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="map-shell relative" data-animate="scale">
                    <iframe
                      title="Ubicación Boutique La Guaca"
                      src="https://www.google.com/maps?q=Calle+37+%231w-139,+Monter%C3%ADa,+C%C3%B3rdoba&z=17&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full min-h-[26rem] w-full"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>
                </div>
              </section>
            </div>

            <aside id="carrito" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <section className="cart-panel" data-animate="scale">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-[oklch(0.86_0.15_85)]" />
                      <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-white/58">Tu carrito</p>
                    </div>
                    <p className="mt-2 text-sm text-white/58">
                      {totals.units === 0 ? "Empieza con cualquier silueta." : `${totals.units} ${totals.units === 1 ? "unidad" : "unidades"} seleccionadas.`}
                    </p>
                  </div>
                  {cart.length > 0 && (
                    <button type="button" className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 transition hover:text-white" onClick={clearCart}>
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="mt-6 max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-white/8 bg-white/4 px-5 py-10 text-center">
                      <ShoppingCart className="mx-auto h-10 w-10 text-white/20" />
                      <p className="mt-4 text-sm text-white/58">Tu selección aparecerá aquí.</p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const effective = getEffectivePrice(item, cart);
                      const isWholesale = effective < item.unitPrice;
                      return (
                        <div key={item.id} className="rounded-[1.35rem] border border-white/8 bg-white/4 p-4" style={{ boxShadow: `inset 0 0 0 1px ${item.accent.replace(")", " / 0.18)")}` }}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-white">{item.productName}</p>
                              <p className="mt-1 text-sm text-white/55">Talla {item.size} · Qty {item.quantity}</p>
                            </div>
                            <button type="button" aria-label={`Eliminar ${item.productName} del carrito`} onClick={() => removeCartItem(item.id)} className="rounded-full p-1 text-white/42 transition hover:bg-white/8 hover:text-[oklch(0.63_0.2_28)]">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-white/58">Unitario</span>
                            <span className={`font-semibold ${isWholesale ? "text-white/45 line-through" : "text-white/78"}`}>{formatPrice(item.unitPrice)}</span>
                          </div>
                          {isWholesale && (
                            <div className="mt-1 flex items-center justify-between text-sm">
                              <span className="text-[oklch(0.86_0.15_85)] text-xs font-bold uppercase tracking-[0.14em]">Mayorista</span>
                              <span className="font-bold text-[oklch(0.86_0.15_85)]">{formatPrice(effective)}</span>
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-white/58">Subtotal</span>
                            <span className="font-bold text-white">{formatPrice(item.quantity * effective)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between text-sm text-white/62">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white/86">{formatPrice(totals.subtotal)}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/62">Ahorro mayorista</span>
                      <span className="font-bold text-[oklch(0.86_0.15_85)]">-{formatPrice(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm font-bold uppercase tracking-[0.16em] text-white/68">Total</span>
                    <span className="text-2xl font-black text-white">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className={`${cart.length === 0 ? "ghost-button text-white/52" : "chrome-button"} mt-6 h-12 w-full font-extrabold uppercase tracking-[0.16em]`}
                  disabled={cart.length === 0}
                  onClick={() => {
                    trackEvent("open_checkout_panel");
                    setCheckoutOpen(true);
                  }}
                >
                  Finalizar compra
                </Button>
                <p className="mt-3 text-center text-xs leading-5 text-white/45">Se genera un mensaje listo para enviar por WhatsApp.</p>
              </section>

              <section className="service-panel hidden lg:block" data-animate="up">
                <div className="service-row">
                  <Gauge className="h-4 w-4 text-[oklch(0.86_0.15_85)]" />
                  <div>
                    <p>Asesoría por talla</p>
                    <small>Te guiamos antes de cerrar.</small>
                  </div>
                </div>
                <div className="service-row">
                  <ShieldCheck className="h-4 w-4 text-[oklch(0.57_0.17_258)]" />
                  <div>
                    <p>Compra directa</p>
                    <small>Resumen listo para WhatsApp.</small>
                  </div>
                </div>
                <div className="service-row">
                  <Star className="h-4 w-4 text-[oklch(0.63_0.2_28)]" />
                  <div>
                    <p>Retiro o envío</p>
                    <small>Montería y pedidos especiales.</small>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>

        <footer className="container pt-4 lg:pt-6">
          <div className="section-shell border-white/8 bg-[linear-gradient(180deg,oklch(0.12_0.01_255_/_0.96),oklch(0.08_0.01_255_/_0.98))] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
              <div>
                <p className="display-title text-3xl text-white">La Guaca</p>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">Boutique exclusiva de moda urbana y deportiva. Un drop para comprar rápido, verse premium y cerrar directo.</p>
              </div>

              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/68">Enlaces</p>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <a href="#" className="footer-link">Inicio</a>
                  <a href="#coleccion" className="footer-link">Productos</a>
                  <a href="#contacto" className="footer-link">Contacto</a>
                  <a href="#carrito" className="footer-link">Carrito</a>
                </div>
              </div>

              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/68">Síguenos</p>
                <div className="mt-4 flex items-center gap-4">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="floating-social">
                    <Instagram className="h-5 w-5 text-white" />
                  </a>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="floating-social">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/68">Contacto</p>
                <div className="mt-4 space-y-3 text-sm text-white/62">
                  <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[oklch(0.86_0.15_85)]" />{WHATSAPP_DISPLAY}</p>
                  <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[oklch(0.57_0.17_258)]" />info@boutiquelaguaca.com</p>
                  <p className="flex items-center gap-3 leading-6"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[oklch(0.63_0.2_28)]" />Calle 37 #1w-139, Montería</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/8 pt-5 text-center text-xs uppercase tracking-[0.2em] text-white/35">© 2026 Boutique La Guaca · Selección Colombia 2026</div>
          </div>
        </footer>

        <div className="fixed bottom-4 right-4 z-40 hidden flex-col gap-3 lg:flex">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="floating-social" aria-label="Seguir a La Guaca en Instagram">
            <Instagram className="h-5 w-5 text-[oklch(0.63_0.2_28)]" />
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="floating-social" aria-label="Enviar mensaje por WhatsApp">
            <MessageCircle className="h-5 w-5 text-[oklch(0.86_0.15_85)]" />
          </a>
        </div>

        {cart.length > 0 && (
          <div className="mobile-checkout-bar lg:hidden">
            <div>
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-white/45">Tu selección</p>
              <p className="mt-1 text-sm font-bold text-white">{totals.units} {totals.units === 1 ? "unidad" : "unidades"} · {formatPrice(totals.total)}</p>
            </div>
            <Button
              type="button"
              className="chrome-button h-11 px-5 text-sm font-extrabold"
              onClick={() => {
                trackEvent("open_checkout_mobile_bar");
                setCheckoutOpen(true);
              }}
            >
              Comprar
            </Button>
          </div>
        )}
      </main>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-h-[82svh] w-[calc(100vw-1rem)] overflow-y-auto rounded-[1.2rem] border-white/10 bg-[oklch(0.12_0.01_255_/_0.96)] p-0 text-white sm:max-h-[88svh] sm:w-full sm:rounded-[1.6rem] sm:max-w-[34rem]">
          <div className="p-4 sm:p-8">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/80 transition hover:bg-white/10 hover:text-white"
                onClick={() => setCheckoutOpen(false)}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver
              </button>
              <button
                type="button"
                aria-label="Cerrar checkout"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/70 transition hover:bg-white/12 hover:text-white"
                onClick={() => setCheckoutOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DialogHeader>
              <DialogTitle className="display-title text-[2rem] text-white sm:text-3xl">Completa tu pedido</DialogTitle>
              <DialogDescription className="mt-3 max-w-md text-sm leading-7 text-white/60">Validamos tus datos y generamos el mensaje final para WhatsApp.</DialogDescription>
            </DialogHeader>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Nombre completo</label>
                <input value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} placeholder="Escribe tu nombre" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                {customerErrors.name && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Celular</label>
                <input value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} placeholder="320 647 3108" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                {customerErrors.phone && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.phone}</p>}
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Correo electrónico (opcional)</label>
                <input value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} placeholder="tu@correo.com" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                {customerErrors.email && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Método de entrega</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`h-11 rounded-2xl border text-sm font-bold transition ${customer.deliveryMethod === "envio" ? "border-[oklch(0.86_0.15_85)] bg-[oklch(0.86_0.15_85_/_0.12)] text-white" : "border-white/10 bg-white/4 text-white/70 hover:bg-white/8"}`}
                    onClick={() => setCustomer((current) => ({ ...current, deliveryMethod: "envio" }))}
                  >
                    Envío
                  </button>
                  <button
                    type="button"
                    className={`h-11 rounded-2xl border text-sm font-bold transition ${customer.deliveryMethod === "retiro" ? "border-[oklch(0.86_0.15_85)] bg-[oklch(0.86_0.15_85_/_0.12)] text-white" : "border-white/10 bg-white/4 text-white/70 hover:bg-white/8"}`}
                    onClick={() => setCustomer((current) => ({ ...current, deliveryMethod: "retiro" }))}
                  >
                    Retiro tienda
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Ciudad</label>
                  <input value={customer.city} onChange={(event) => setCustomer((current) => ({ ...current, city: event.target.value }))} placeholder="Montería" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                  {customerErrors.city && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.city}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Barrio / zona</label>
                  <input value={customer.neighborhood} onChange={(event) => setCustomer((current) => ({ ...current, neighborhood: event.target.value }))} placeholder="Juan XXIII" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                  {customerErrors.neighborhood && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.neighborhood}</p>}
                </div>
              </div>

              {customer.deliveryMethod === "envio" && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Dirección de entrega</label>
                    <input value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} placeholder="Calle, carrera, número y apartamento/casa" className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                    {customerErrors.address && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.address}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Referencia</label>
                    <input value={customer.reference} onChange={(event) => setCustomer((current) => ({ ...current, reference: event.target.value }))} placeholder="Casa esquinera, portón negro, al lado de..." className="h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition focus:border-[oklch(0.86_0.15_85)] focus:bg-white/8" />
                    {customerErrors.reference && <p className="mt-2 text-xs text-[oklch(0.63_0.2_28)]">{customerErrors.reference}</p>}
                  </div>
                </>
              )}
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/52">Resumen listo para enviar</p>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-white/72">{whatsappMessage}</pre>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className="ghost-button h-12 px-5 font-bold text-white" onClick={() => setCheckoutOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" className="chrome-button h-12 px-5 font-extrabold uppercase tracking-[0.16em]" disabled={!isCheckoutValid} onClick={handleSendOrder}>
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="border-white/10 bg-[oklch(0.12_0.01_255_/_0.96)] text-white sm:max-w-[28rem]">
          <DialogHeader>
            <DialogTitle className="display-title text-3xl text-white">Pedido preparado</DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-7 text-white/62">Abrimos WhatsApp con tu resumen listo. Puedes seguir explorando el drop cuando quieras.</DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-end">
            <Button type="button" className="chrome-button h-12 px-5 font-extrabold" onClick={() => setConfirmationOpen(false)}>
              Volver
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!imagePreview} onOpenChange={(open) => !open && setImagePreview(null)}>
        <DialogContent className="max-w-[92vw] border-white/10 bg-[oklch(0.09_0.01_255_/_0.98)] p-3 text-white sm:max-w-[28rem]">
          {imagePreview && (
            <div className="rounded-xl border border-white/10 bg-[oklch(0.12_0.01_255_/_0.85)] p-2">
              <img src={imagePreview.src} alt={imagePreview.alt} className="mx-auto max-h-[70svh] w-auto object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="max-h-[86svh] overflow-y-auto border-white/10 bg-[oklch(0.12_0.01_255_/_0.96)] text-white sm:max-w-[34rem]">
          <DialogHeader>
            <DialogTitle className="display-title text-3xl text-white">Guía de tallas</DialogTitle>
            <DialogDescription className="text-sm text-white/62">Medidas aproximadas en centímetros para elegir mejor tu talla.</DialogDescription>
          </DialogHeader>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/6 text-white/72">
                <tr>
                  <th className="px-3 py-2 text-left">Talla</th>
                  <th className="px-3 py-2 text-left">Pecho</th>
                  <th className="px-3 py-2 text-left">Largo</th>
                  <th className="px-3 py-2 text-left">Referencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8 text-white/82">
                {[
                  ["XS", "88-92", "64-66", "Ajustado"],
                  ["S", "92-96", "66-68", "Regular"],
                  ["M", "96-102", "68-71", "Regular"],
                  ["L", "102-108", "71-74", "Cómodo"],
                  ["XL", "108-114", "74-77", "Amplio"],
                  ["XXL", "114-120", "77-80", "Amplio"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="px-3 py-2 font-bold">{row[0]}</td>
                    <td className="px-3 py-2">{row[1]} cm</td>
                    <td className="px-3 py-2">{row[2]} cm</td>
                    <td className="px-3 py-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-white/58">Tip: si te gusta holgado, sube una talla. Para fit pro, mantén tu talla habitual.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
