// Image URLs for Steiny's Restaurant
// You can upload images to your S3 bucket and update these URLs

const S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || "https://general-public-image-buckets.s3.amazonaws.com";

export const images = {
  hero: {
    burger: `${S3_BASE_URL}/steiny/images/hero/hero-burger.png`,
    background: `${S3_BASE_URL}/steiny/images/hero/hero-bg.png`,
  },
  burgers: {
    cheeseBurger: `${S3_BASE_URL}/steiny/images/burgers/cheese-burger.png`,
    doubleCheeseBurger: `${S3_BASE_URL}/steiny/images/burgers/double-cheese-burger.png`,
    jalapenoCheeseBurger: `${S3_BASE_URL}/steiny/images/burgers/jalapeno-cheese-burger.png`,
  },
  chicken: {
    nashvilleHot: `${S3_BASE_URL}/steiny/images/chicken/nashville-hot.png`,
    buffaloRanch: `${S3_BASE_URL}/steiny/images/chicken/buffalo-ranch.png`,
    sweetChili: `${S3_BASE_URL}/steiny/images/chicken/sweet-chili.png`,
  },
  sides: {
    fries: `${S3_BASE_URL}/steiny/images/sides/fries.png`,
    loadedBeefFries: `${S3_BASE_URL}/steiny/images/sides/loaded-beef-fries.jpg`,
    loadedChickenFries: `${S3_BASE_URL}/steiny/images/sides/loaded-chicken-fries.png`,
    tenders: `${S3_BASE_URL}/steiny/images/sides/hot-tenders.png`,
    biscuit: `${S3_BASE_URL}/steiny/images/sides/buttermilk-biscuit.png`,
  },
  drinks: {
    softDrinks: `${S3_BASE_URL}/steiny/images/drinks/soft-drinks.png`,
    vanillaShake: `https://general-public-image-buckets.s3.amazonaws.com/steiny/images/drinks/vanilla-shake.png`,
    nutellaShake: `${S3_BASE_URL}/steiny/images/drinks/nutella-shake.png`,
    strawberryShake: `${S3_BASE_URL}/steiny/images/drinks/strawberry-shake.png`,
    oreoShake: `${S3_BASE_URL}/steiny/images/drinks/oreo-shake.png`,
  },
  meals: {
    cheeseBurgerMeal: `${S3_BASE_URL}/steiny/images/meals/cheese-burger-meal.png`,
    doubleCheeseBurgerMeal: `${S3_BASE_URL}/steiny/images/meals/double-cheese-burger-meal.png`,
    jalapenoBurgerMeal: `${S3_BASE_URL}/steiny/images/meals/jalapeno-burger-meal.png`,
    nashvilleHotMeal: `${S3_BASE_URL}/steiny/images/meals/nashville-hot-meal.png`,
    buffaloRanchMeal: `${S3_BASE_URL}/steiny/images/meals/buffalo-ranch-meal.png`,
    sweetChiliMeal: `${S3_BASE_URL}/steiny/images/meals/sweet-chili-meal.png`,
    loadedFriesCombo: `${S3_BASE_URL}/steiny/images/meals/loaded-fries-combo.png`,
    tendersMeal: `${S3_BASE_URL}/steiny/images/meals/tenders-meal.png`,
  },
  restaurant: {
    interior: `${S3_BASE_URL}/steiny/images/restaurant/interior.png`,
    exterior: `${S3_BASE_URL}/steiny/images/restaurant/exterior.png`,
    kitchen: `${S3_BASE_URL}/steiny/images/restaurant/kitchen.png`,
  },
  videos: {
    heroVideo: `${S3_BASE_URL}/steiny/videos/hero-video.mp4`,
    burgerMaking: `${S3_BASE_URL}/steiny/videos/burger-making.mp4`,
  }
};

// Placeholder images for development (using Unsplash)
export const placeholderImages = {
  hero: {
    burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    background: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80",
  },
  burgers: {
    cheeseBurger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    doubleCheeseBurger: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80",
    jalapenoCheeseBurger: "https://images.unsplash.com/photo-1595531172949-30922c28a240?w=600&q=80",
  },
  chicken: {
    nashvilleHot: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
    buffaloRanch: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80",
    sweetChili: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  },
  sides: {
    fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
    loadedBeefFries: "https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=600&q=80",
    loadedChickenFries: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&q=80",
    tenders: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
    biscuit: "https://images.unsplash.com/photo-1555951015-2da9bab6e0e9?w=600&q=80",
  },
  drinks: {
    softDrinks: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
    vanillaShake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
    nutellaShake: "https://images.unsplash.com/photo-1612534847738-b3b7f0a0d8b9?w=600&q=80",
    strawberryShake: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&q=80",
    oreoShake: "https://images.unsplash.com/photo-1619158401201-8fa932695178?w=600&q=80",
  },
  meals: {
    cheeseBurgerMeal: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
    doubleCheeseBurgerMeal: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80",
    jalapenoBurgerMeal: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=800&q=80",
    nashvilleHotMeal: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    buffaloRanchMeal: "https://images.unsplash.com/photo-1610614819093-5b0ce6b8c7a5?w=800&q=80",
    sweetChiliMeal: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80",
    loadedFriesCombo: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=800&q=80",
    tendersMeal: "https://images.unsplash.com/photo-1619474387533-d1e4c0886c56?w=800&q=80",
  },
  restaurant: {
    interior: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    exterior: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  }
};

// Hybrid approach: Use S3 images where available, placeholders for missing
export const currentImages = {
  hero: {
    burger: placeholderImages.hero.burger, // Missing - using placeholder
    background: images.hero.background, // ✓ Uploaded
  },
  burgers: {
    cheeseBurger: images.burgers.cheeseBurger, // ✓ Uploaded
    doubleCheeseBurger: images.burgers.doubleCheeseBurger, // ✓ Uploaded
    jalapenoCheeseBurger: images.burgers.jalapenoCheeseBurger, // ✓ Uploaded
  },
  chicken: {
    nashvilleHot: images.chicken.nashvilleHot, // ✓ Uploaded
    buffaloRanch: images.chicken.buffaloRanch, // ✓ Uploaded
    sweetChili: images.chicken.sweetChili, // ✓ Uploaded
  },
  sides: {
    fries: placeholderImages.sides.fries, // Missing - using placeholder
    loadedBeefFries: images.sides.loadedBeefFries, // ✓ Uploaded
    loadedChickenFries: images.sides.loadedChickenFries, // ✓ Uploaded
    tenders: images.sides.tenders, // ✓ Uploaded
    biscuit: placeholderImages.sides.biscuit, // Missing - using placeholder
  },
  drinks: {
    softDrinks: placeholderImages.drinks.softDrinks, // Missing - using placeholder
    vanillaShake: images.drinks.vanillaShake, // ✓ Uploaded
    nutellaShake: images.drinks.nutellaShake, // ✓ Uploaded
    strawberryShake: placeholderImages.drinks.strawberryShake, // Missing - using placeholder
    oreoShake: images.drinks.oreoShake, // ✓ Uploaded
  },
  meals: {
    cheeseBurgerMeal: images.meals.cheeseBurgerMeal, // ✓ Uploaded
    doubleCheeseBurgerMeal: placeholderImages.meals.doubleCheeseBurgerMeal, // Missing - using placeholder
    jalapenoBurgerMeal: placeholderImages.meals.jalapenoBurgerMeal, // Missing - using placeholder
    nashvilleHotMeal: placeholderImages.meals.nashvilleHotMeal, // Missing - using placeholder
    buffaloRanchMeal: placeholderImages.meals.buffaloRanchMeal, // Missing - using placeholder
    sweetChiliMeal: images.meals.sweetChiliMeal, // ✓ Uploaded
    loadedFriesCombo: placeholderImages.meals.loadedFriesCombo, // Missing - using placeholder
    tendersMeal: placeholderImages.meals.tendersMeal, // Missing - using placeholder
  },
  restaurant: {
    interior: placeholderImages.restaurant.interior, // Missing - using placeholder
    exterior: placeholderImages.restaurant.exterior, // Missing - using placeholder
    kitchen: placeholderImages.restaurant.kitchen, // Missing - using placeholder
  }
};