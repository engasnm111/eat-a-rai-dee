import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      brand: {
        name: 'eat a rai dee',
        tagline: 'เที่ยงนี้กินอะไรดี?',
      },
      header: {
        discover: 'หาร้านใกล้ฉัน',
        editSearch: 'ปรับการค้นหา',
        language: 'ภาษา',
      },
      auth: {
        account: 'บัญชีของฉัน',
        signIn: 'เข้าสู่ระบบ Google',
        signInShort: 'เข้าสู่ระบบ',
        signOut: 'ออกจากระบบ',
        notConfigured: 'ยังไม่ได้ตั้งค่า Supabase สำหรับเว็บไซต์',
        providerDisabled: 'ต้องเปิด Google ใน Supabase Auth ก่อน',
        signInFailed: 'เข้าสู่ระบบไม่สำเร็จ ตรวจการตั้งค่า Google ใน Supabase',
        signOutFailed: 'ออกจากระบบไม่สำเร็จ ลองอีกครั้ง',
      },
      hero: {
        title: 'พักเที่ยงนี้ อร่อยที่ไหนดี',
        description: 'เลือกสิ่งที่อยากกิน แล้วให้ร้านใกล้ตัวปรากฏบนแผนที่',
        start: 'เริ่มหาร้าน',
        radius: 'รัศมี {{distance}}',
      },
      search: {
        heading: 'วันนี้อยากกินอะไร?',
        description: 'หาร้านใกล้คุณในไม่กี่คลิก เลือกได้มากกว่าหนึ่งแนว',
        keyword: 'ชื่อร้านหรือเมนูที่นึกออก',
        keywordPlaceholder: 'เช่น กะเพรา, ramen, ข้าวมันไก่',
        quickHeading: 'เลือกแนวที่อยากกิน',
        quickHint: 'เลือกได้หลายอย่าง',
        categorySearch: 'ค้นหาประเภทอาหาร เช่น ชาบู หมูกรอบ',
        categoryEmpty: 'ไม่พบหมวดอาหารที่ค้นหา',
        showAllCategories: 'ดูอีก {{count}} หมวด',
        showFeatured: 'แสดงหมวดเด่น',
        browseCategories: 'ดูหมวดอาหารทั้งหมด',
        travelModeHeading: 'เดินทางไปยังไง?',
        travelMode: {
          driving: 'รถยนต์',
          'two-wheeler': 'มอเตอร์ไซค์',
          bicycling: 'จักรยาน',
          walking: 'เดิน',
        },
        radiusHeading: 'ค้นหาไกลแค่ไหน?',
        radiusUnit: '{{distance}} กม.',
        radiusHint:
          'รัศมีค้นหาวัดเป็นเส้นตรงจากจุดเริ่มต้น ระยะทางบนถนนดูได้ใน Google Maps',
        locationHeading: 'ค้นหาจากจุดไหน',
        sampleLocation: 'สยาม กรุงเทพฯ (จุดตัวอย่าง)',
        myLocation: 'ตำแหน่งของฉัน',
        pickedLocation: 'จุดที่เลือกบนแผนที่',
        useMyLocation: 'ใช้ตำแหน่งฉัน',
        locating: 'กำลังหาตำแหน่ง...',
        pickOnMap: 'ปักจุดบนแผนที่',
        advanced: 'ตัวกรองเพิ่มเติม',
        ratings: 'คะแนนดาว',
        ratingsUnavailable:
          'ข้อมูล OpenStreetMap ไม่มีคะแนนรีวิวแบบ Google จึงยังกรองดาวไม่ได้',
        ratingAny: 'ทุกคะแนน',
        submit: 'ค้นหาร้านใกล้ฉัน',
        close: 'ปิดหน้าค้นหา',
        locationDenied:
          'ไม่สามารถเข้าถึงตำแหน่งได้ เลือกจุดบนแผนที่หรือใช้จุดตัวอย่างแทน',
        locationUnavailable:
          'อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง เลือกจุดบนแผนที่แทน',
      },
      quick: {
        thai: 'อาหารไทย / ตามสั่ง',
        noodles: 'ก๋วยเตี๋ยว',
        dessert: 'ของหวาน',
        coffee: 'กาแฟ / คาเฟ่',
        fastFood: 'จานด่วน',
        barbecue: 'ปิ้งย่าง',
        buffet: 'บุฟเฟ่ต์',
        shabuSuki: 'ชาบู / สุกี้',
        crispyPork: 'หมูกรอบ',
        mookata: 'หมูกระทะ',
        mala: 'หม่าล่า',
        seafood: 'อาหารทะเล',
        sushi: 'ซูชิ',
        japanese: 'อาหารญี่ปุ่น',
        korean: 'อาหารเกาหลี',
        pizza: 'พิซซ่า',
        burger: 'เบอร์เกอร์',
        friedChicken: 'ไก่ทอด',
        chickenRice: 'ข้าวมันไก่',
        steak: 'สเต๊ก',
        somTam: 'ส้มตำ',
        dimSum: 'ติ่มซำ',
        bubbleTea: 'ชานมไข่มุก',
      },
      advanced: {
        openNow: 'เปิดตอนนี้',
        vegetarian: 'มีอาหารมังสวิรัติ',
        wheelchair: 'รองรับรถเข็น',
        takeaway: 'ซื้อกลับบ้าน',
        delivery: 'มีบริการส่ง',
        note: 'ตัวกรองใช้แท็ก OpenStreetMap ร้านที่ไม่ระบุข้อมูลจะไม่ผ่าน เวลาเปิดคำนวณตามเวลาในอุปกรณ์',
      },
      map: {
        title: 'แผนที่ร้านอาหาร',
        loading: 'กำลังโหลดแผนที่...',
        sample: 'จุดเริ่มต้น',
        pickPrompt: 'แตะตำแหน่งบนแผนที่เพื่อกำหนดจุดเริ่มต้น',
        cancelPick: 'ยกเลิก',
        pinsLimit: 'แสดงหมุดใกล้ที่สุด {{count}} ร้าน',
      },
      results: {
        heading: 'ร้านที่น่าแวะ',
        count: 'พบ {{count}} ร้าน',
        idle: 'พร้อมออกไปกินแล้วหรือยัง? เริ่มค้นหาเพื่อดูร้านรอบตัว',
        loading: 'กำลังหาร้านใกล้จุดที่เลือก...',
        empty: 'ยังไม่พบร้านที่ตรงทุกเงื่อนไข ลองขยายรัศมีหรือลดตัวกรอง',
        more: 'ดูร้านเพิ่มเติม',
        visible: 'แสดง {{shown}} จาก {{total}} ร้าน',
        clearFilters: 'ล้างตัวกรอง',
        sort: 'เรียงตามระยะเส้นตรง',
      },
      place: {
        details: 'ดูรายละเอียดร้าน',
        route: 'ดูเส้นทาง: {{mode}}',
        closeDetails: 'ปิดรายละเอียดร้าน',
        open: 'เปิดอยู่',
        closed: 'ปิดอยู่',
        hoursUnknown: 'ไม่ระบุเวลาเปิด',
        distanceMeters: '{{count}} ม.',
        distanceKm: '{{distance}} กม.',
        addressUnknown: 'ไม่มีข้อมูลที่อยู่',
        osmDetails: 'ดูข้อมูลต้นทาง',
        category: {
          restaurant: 'ร้านอาหาร',
          cafe: 'คาเฟ่',
          fast_food: 'อาหารจานด่วน',
          food_court: 'ศูนย์อาหาร',
          dessert: 'ของหวาน',
          bakery: 'เบเกอรี่',
        },
      },
      errors: {
        RATE_LIMITED: 'เซิร์ฟเวอร์ข้อมูลร้านกำลังยุ่ง รอสักครู่แล้วลองอีกครั้ง',
        UNAVAILABLE:
          'เชื่อมต่อข้อมูลร้านไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง',
        BAD_RESPONSE: 'ข้อมูลร้านที่ได้รับไม่สมบูรณ์ ลองค้นหาอีกครั้ง',
        TIMEOUT: 'การค้นหาใช้เวลานานเกินไป ลองลดรัศมีแล้วค้นหาใหม่',
        SERVER_BUSY: 'บริการข้อมูลร้านตอบไม่ทัน ลองลดรัศมีแล้วค้นหาใหม่ภายหลัง',
        UNKNOWN: 'ค้นหาร้านไม่สำเร็จ ลองอีกครั้ง',
        retry: 'ลองอีกครั้ง',
      },
      footer: {
        source:
          'ข้อมูลร้านจาก OpenStreetMap อาจไม่ครบหรือไม่อัปเดต กรุณาตรวจสอบกับร้านก่อนเดินทาง',
        credit: 'สร้างเพื่อมื้อเที่ยงที่ตัดสินใจง่ายขึ้น',
      },
    },
  },
  en: {
    translation: {
      brand: {
        name: 'eat a rai dee',
        tagline: 'What should we eat today?',
      },
      header: {
        discover: 'Find nearby food',
        editSearch: 'Edit search',
        language: 'Language',
      },
      auth: {
        account: 'My account',
        signIn: 'Sign in with Google',
        signInShort: 'Sign in',
        signOut: 'Sign out',
        notConfigured: 'Supabase is not configured for this site yet',
        providerDisabled: 'Enable Google in Supabase Auth first.',
        signInFailed: 'Sign-in failed. Check the Google provider in Supabase.',
        signOutFailed: 'Sign-out failed. Please try again.',
      },
      hero: {
        title: 'Find your next lunch spot',
        description:
          'Pick what sounds good and explore nearby places on the map.',
        start: 'Find food',
        radius: '{{distance}} radius',
      },
      search: {
        heading: 'What are you craving?',
        description:
          'Find nearby places in a few taps. Pick more than one craving.',
        keyword: 'Restaurant or dish',
        keywordPlaceholder: 'e.g. noodles, coffee, chicken rice',
        quickHeading: 'Pick your cravings',
        quickHint: 'Choose several',
        categorySearch: 'Search food types, e.g. shabu or crispy pork',
        categoryEmpty: 'No food categories found',
        showAllCategories: 'Explore {{count}} more',
        showFeatured: 'Show featured picks',
        browseCategories: 'Explore all food categories',
        travelModeHeading: 'How are you travelling?',
        travelMode: {
          driving: 'Car',
          'two-wheeler': 'Motorcycle',
          bicycling: 'Bicycle',
          walking: 'Walking',
        },
        radiusHeading: 'Search within',
        radiusUnit: '{{distance}} km',
        radiusHint:
          'Search radius is straight-line distance from your starting point. Check road distance in Google Maps.',
        locationHeading: 'Search from',
        sampleLocation: 'Siam, Bangkok (sample point)',
        myLocation: 'My location',
        pickedLocation: 'Picked on the map',
        useMyLocation: 'Use my location',
        locating: 'Finding location...',
        pickOnMap: 'Pick on map',
        advanced: 'More filters',
        ratings: 'Star rating',
        ratingsUnavailable:
          'OpenStreetMap has no Google style review scores, so rating filters are unavailable.',
        ratingAny: 'Any rating',
        submit: 'Find nearby places',
        close: 'Close search',
        locationDenied:
          'Location access failed. Pick a point on the map or use the sample point.',
        locationUnavailable:
          'This device cannot provide its location. Pick a point on the map instead.',
      },
      quick: {
        thai: 'Thai / made to order',
        noodles: 'Noodles',
        dessert: 'Desserts',
        coffee: 'Coffee / cafés',
        fastFood: 'Quick bites',
        barbecue: 'Barbecue',
        buffet: 'Buffet',
        shabuSuki: 'Shabu / suki',
        crispyPork: 'Crispy pork',
        mookata: 'Thai barbecue',
        mala: 'Mala',
        seafood: 'Seafood',
        sushi: 'Sushi',
        japanese: 'Japanese',
        korean: 'Korean',
        pizza: 'Pizza',
        burger: 'Burgers',
        friedChicken: 'Fried chicken',
        chickenRice: 'Chicken rice',
        steak: 'Steak',
        somTam: 'Som tam',
        dimSum: 'Dim sum',
        bubbleTea: 'Bubble tea',
      },
      advanced: {
        openNow: 'Open now',
        vegetarian: 'Vegetarian options',
        wheelchair: 'Wheelchair access',
        takeaway: 'Takeaway',
        delivery: 'Delivery',
        note: 'Filters use OpenStreetMap tags. Untagged places are excluded. Opening hours use your device time.',
      },
      map: {
        title: 'Restaurant map',
        loading: 'Loading map...',
        sample: 'Starting point',
        pickPrompt: 'Tap the map to choose your starting point',
        cancelPick: 'Cancel',
        pinsLimit: 'Showing the nearest {{count}} map pins',
      },
      results: {
        heading: 'Places to try',
        count: '{{count}} places found',
        idle: 'Ready for lunch? Start a search to see places nearby.',
        loading: 'Looking for places near your starting point...',
        empty:
          'No places match all filters. Try a wider radius or fewer filters.',
        more: 'Show more places',
        visible: 'Showing {{shown}} of {{total}} places',
        clearFilters: 'Clear filters',
        sort: 'Nearest by straight-line distance',
      },
      place: {
        details: 'View place details',
        route: 'Directions: {{mode}}',
        closeDetails: 'Close place details',
        open: 'Open now',
        closed: 'Closed now',
        hoursUnknown: 'Hours not listed',
        distanceMeters: '{{count}} m',
        distanceKm: '{{distance}} km',
        addressUnknown: 'Address not listed',
        osmDetails: 'View source details',
        category: {
          restaurant: 'Restaurant',
          cafe: 'Café',
          fast_food: 'Fast food',
          food_court: 'Food court',
          dessert: 'Desserts',
          bakery: 'Bakery',
        },
      },
      errors: {
        RATE_LIMITED:
          'The place data server is busy. Wait a moment and try again.',
        UNAVAILABLE:
          'Could not reach place data. Check your connection and try again.',
        BAD_RESPONSE: 'Place data was incomplete. Please search again.',
        TIMEOUT: 'The search took too long. Try a smaller radius.',
        SERVER_BUSY:
          'The place data service could not complete this search. Try a smaller radius later.',
        UNKNOWN: 'Search failed. Please try again.',
        retry: 'Try again',
      },
      footer: {
        source:
          'OpenStreetMap place data may be incomplete or outdated. Check with the place before visiting.',
        credit: 'Made for easier lunch decisions',
      },
    },
  },
} as const;

function savedLanguage(): 'th' | 'en' {
  try {
    return window.localStorage.getItem('eat-a-rai-dee:language') === 'en'
      ? 'en'
      : 'th';
  } catch {
    return 'th';
  }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage(),
  fallbackLng: 'th',
  interpolation: { escapeValue: false },
});

function applyDocumentLanguage(language: string) {
  document.documentElement.lang = language;
  document.title = `eat a rai dee — ${i18n.t('brand.tagline', { lng: language })}`;
  try {
    window.localStorage.setItem('eat-a-rai-dee:language', language);
  } catch {
    // Language choice still works when storage is unavailable.
  }
}

i18n.on('languageChanged', applyDocumentLanguage);
applyDocumentLanguage(i18n.language);

export { i18n };
