import type { QuickFilterId, RestaurantCategory } from './types';

interface QuickFilterDefinition {
  featured?: boolean;
  categories?: readonly RestaurantCategory[];
  cuisines?: readonly string[];
  namePattern?: RegExp;
  tags?: Readonly<Record<string, readonly string[]>>;
  aliases?: readonly string[];
}

export const QUICK_FILTER_CATALOG: Record<
  QuickFilterId,
  QuickFilterDefinition
> = {
  thai: {
    featured: true,
    cuisines: ['thai'],
    namePattern: /ตามสั่ง|ข้าวแกง|กะเพรา|กระเพรา|อาหารไทย/iu,
  },
  noodles: {
    featured: true,
    cuisines: ['noodle', 'noodles', 'ramen', 'pho'],
    namePattern:
      /ก๋วยเตี๋ยว|บะหมี่|ก๋วยจั๊บ|ราเมน|\bnoodles?\b|\bramen\b|\bpho\b/iu,
  },
  dessert: {
    featured: true,
    categories: ['dessert', 'bakery'],
    cuisines: ['dessert', 'ice_cream', 'cake', 'pastry'],
    namePattern: /ขนม|เบเกอรี่|ไอศกรีม|\bice.?cream\b|\bdessert\b|\bbakery\b/iu,
  },
  coffee: {
    featured: true,
    categories: ['cafe'],
    cuisines: ['coffee_shop', 'coffee'],
    namePattern: /กาแฟ|คาเฟ่|\bcoffee\b|\bcafe\b/iu,
  },
  fastFood: { featured: true, categories: ['fast_food'] },
  barbecue: {
    featured: true,
    cuisines: ['barbecue', 'bbq', 'korean_barbecue'],
    namePattern: /ปิ้งย่าง|หมูกระทะ|บาร์บีคิว|\bbarbecue\b|\bbbq\b/iu,
  },
  buffet: {
    featured: true,
    cuisines: ['buffet'],
    tags: { buffet: ['yes', 'only'] },
    namePattern: /บุฟเฟ่ต์|บุฟเฟต์|\bbuffet\b|\ball[ -]you[ -]can[ -]eat\b/iu,
  },
  shabuSuki: {
    featured: true,
    cuisines: ['hot_pot', 'shabu_shabu', 'sukiyaki'],
    namePattern: /ชาบู|สุกี้|\bshabu\b|\bsuki(?:yaki)?\b|\bhot[ -]?pot\b/iu,
    aliases: ['hotpot', 'หม้อไฟ'],
  },
  crispyPork: {
    featured: true,
    cuisines: ['crispy_pork'],
    namePattern: /หมูกรอบ|\bcrispy[ -]?pork\b|\bsiu[ -]?yuk\b/iu,
  },
  mookata: {
    cuisines: ['mookata', 'mu_kratha'],
    namePattern: /หมูกระทะ|\bmoo[ -]?kata\b|\bmu[ -]?kratha\b/iu,
  },
  mala: {
    cuisines: ['mala'],
    namePattern: /หม่าล่า|หมาล่า|\bmala\b/iu,
  },
  seafood: {
    cuisines: ['seafood'],
    namePattern: /อาหารทะเล|ซีฟู้ด|กุ้งเผา|\bseafood\b/iu,
  },
  sushi: {
    cuisines: ['sushi'],
    namePattern: /ซูชิ|ซาชิมิ|\bsushi\b|\bsashimi\b/iu,
  },
  japanese: {
    cuisines: ['japanese'],
    namePattern: /อาหารญี่ปุ่น|\bjapanese\b/iu,
  },
  korean: {
    cuisines: ['korean'],
    namePattern: /อาหารเกาหลี|\bkorean\b/iu,
  },
  pizza: {
    cuisines: ['pizza'],
    namePattern: /พิซซ่า|\bpizza\b/iu,
  },
  burger: {
    cuisines: ['burger'],
    namePattern: /เบอร์เกอร์|\bburgers?\b/iu,
  },
  friedChicken: {
    cuisines: ['fried_chicken'],
    namePattern: /ไก่ทอด|\bfried[ -]?chicken\b/iu,
  },
  chickenRice: {
    cuisines: ['chicken_rice'],
    namePattern: /ข้าวมันไก่|\bchicken[ -]?rice\b/iu,
  },
  steak: {
    cuisines: ['steak', 'steak_house'],
    namePattern: /สเต๊ก|สเต็ก|\bsteak\b/iu,
  },
  somTam: {
    cuisines: ['som_tam'],
    namePattern: /ส้มตำ|ส้มตํา|\bsom[ -]?tam\b|\bpapaya[ -]?salad\b/iu,
  },
  dimSum: {
    cuisines: ['dim_sum'],
    namePattern: /ติ่มซำ|ติ่มซํา|\bdim[ -]?sum\b/iu,
  },
  bubbleTea: {
    cuisines: ['bubble_tea'],
    namePattern: /ชานมไข่มุก|ชานม|\bbubble[ -]?tea\b|\bboba\b/iu,
  },
};

export const QUICK_FILTER_IDS = Object.keys(
  QUICK_FILTER_CATALOG,
) as QuickFilterId[];
export const FEATURED_QUICK_FILTER_IDS = QUICK_FILTER_IDS.filter(
  (filter) => QUICK_FILTER_CATALOG[filter].featured,
);
