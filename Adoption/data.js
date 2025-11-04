// Pet data
const pets = [
  {
    id: '1',
    name: 'Bella',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'female',
    size: 'large',
    color: 'Golden',
    location: 'Lahore',
    shelter: {
      name: 'Paws & Claws Rescue',
      phone: '+92 300 1234567',
      email: 'contact@pawsandclaws.org',
      address: '123 Main Street, Lahore',
      website: 'www.pawsandclaws.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
      'https://images.unsplash.com/photo-1612536394628-faddd5c2c147?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Friendly', 'Playful', 'Gentle'],
    description: 'Bella is a sweet and loving Golden Retriever who adores people and other dogs. She enjoys long walks in the park, playing fetch, and cuddling on the couch. Bella is house-trained and knows basic commands. She would thrive in an active family home with a yard where she can run and play.',
    healthHistory: {
      lastVetVisit: 'October 2024',
      diet: 'High-quality dry food, twice daily',
      vaccinations: 'Up to date - Rabies, DHPP, Bordetella'
    },
    adoptionFee: 15000,
    requirements: ['Fenced yard preferred', 'Active family', 'Experience with large breeds']
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Persian',
    age: 1,
    gender: 'female',
    size: 'medium',
    color: 'White',
    location: 'Karachi',
    shelter: {
      name: 'Karachi Cat Sanctuary',
      phone: '+92 321 9876543',
      email: 'info@karachicats.org',
      address: '456 Garden Road, Karachi',
      website: 'www.karachicats.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1acc3?w=800',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10c1d3a1acc3?w=800',
      'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800',
      'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800'
    ],
    vaccinated: true,
    microchipped: false,
    spayedNeutered: true,
    temperament: ['Calm', 'Affectionate', 'Quiet'],
    description: 'Luna is a gorgeous Persian cat with a calm and gentle personality. She loves to be groomed and enjoys quiet environments. Luna is perfect for someone looking for a peaceful companion who enjoys lap time and soft pets. She gets along well with other calm cats.',
    healthHistory: {
      lastVetVisit: 'November 2024',
      diet: 'Premium wet food for Persians, twice daily',
      vaccinations: 'Up to date - FVRCP, Rabies'
    },
    adoptionFee: 10000,
    requirements: ['Indoor only', 'Regular grooming', 'Quiet home preferred']
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    age: 3,
    gender: 'male',
    size: 'large',
    color: 'Black & Tan',
    location: 'Islamabad',
    shelter: {
      name: 'Capital City Animal Rescue',
      phone: '+92 333 5551234',
      email: 'rescue@ccanimals.org',
      address: '789 Blue Area, Islamabad',
      website: 'www.ccanimals.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
    images: [
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800',
      'https://images.unsplash.com/photo-1504826260979-242151ee45b7?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Loyal', 'Protective', 'Intelligent'],
    description: 'Max is a well-trained German Shepherd with a strong protective instinct. He is incredibly loyal to his family and excels at learning new commands. Max needs an experienced owner who understands the breed and can provide mental stimulation and regular exercise.',
    healthHistory: {
      lastVetVisit: 'September 2024',
      diet: 'Large breed dry food, portion controlled',
      vaccinations: 'Up to date - All core vaccines'
    },
    adoptionFee: 20000,
    requirements: ['Experienced dog owner', 'Secure yard required', 'Time for training and exercise']
  },
  {
    id: '4',
    name: 'Milo',
    species: 'cat',
    breed: 'Tabby Mix',
    age: 6,
    gender: 'male',
    size: 'medium',
    color: 'Orange Tabby',
    location: 'Lahore',
    shelter: {
      name: 'Paws & Claws Rescue',
      phone: '+92 300 1234567',
      email: 'contact@pawsandclaws.org',
      address: '123 Main Street, Lahore',
      website: 'www.pawsandclaws.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
      'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Independent', 'Playful', 'Curious'],
    description: 'Milo is a charming orange tabby with a big personality. He loves to explore and play with toys, especially feather wands. While independent, Milo enjoys attention on his terms and will reward you with purrs and head bumps. Great with kids and other pets.',
    healthHistory: {
      lastVetVisit: 'October 2024',
      diet: 'Standard dry food with occasional treats',
      vaccinations: 'Up to date - FVRCP, Rabies'
    },
    adoptionFee: 8000,
    requirements: ['Indoor/outdoor access preferred', 'Patient family', 'No small children']
  },
  {
    id: '5',
    name: 'Daisy',
    species: 'dog',
    breed: 'Beagle',
    age: 4,
    gender: 'female',
    size: 'medium',
    color: 'Tri-color',
    location: 'Karachi',
    shelter: {
      name: 'Happy Tails Foundation',
      phone: '+92 345 7778888',
      email: 'adopt@happytails.org',
      address: '321 Clifton, Karachi',
      website: 'www.happytails.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
    images: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      'https://images.unsplash.com/photo-1612774412069-14f24a815e84?w=800'
    ],
    vaccinated: true,
    microchipped: false,
    spayedNeutered: true,
    temperament: ['Energetic', 'Friendly', 'Vocal'],
    description: 'Daisy is an enthusiastic Beagle who loves sniffing adventures and making new friends. She has a wonderful nose and enjoys scent games. Daisy is social with both people and dogs, though she can be vocal when excited. Perfect for an active family who enjoys outdoor activities.',
    healthHistory: {
      lastVetVisit: 'August 2024',
      diet: 'Weight management food, measured portions',
      vaccinations: 'Up to date - All required vaccines'
    },
    adoptionFee: 12000,
    requirements: ['Daily walks essential', 'Secure fencing', 'Understanding of hound behavior']
  },
  {
    id: '6',
    name: 'Shadow',
    species: 'cat',
    breed: 'Black Domestic Shorthair',
    age: 2,
    gender: 'male',
    size: 'medium',
    color: 'Black',
    location: 'Islamabad',
    shelter: {
      name: 'Capital City Animal Rescue',
      phone: '+92 333 5551234',
      email: 'rescue@ccanimals.org',
      address: '789 Blue Area, Islamabad',
      website: 'www.ccanimals.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800',
    images: [
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Mysterious', 'Playful', 'Affectionate'],
    description: 'Shadow is a stunning black cat with striking green eyes. Despite superstitions, he brings nothing but joy! Shadow is playful and loves interactive toys. He forms strong bonds with his humans and enjoys being part of daily activities. A true lap cat once he trusts you.',
    healthHistory: {
      lastVetVisit: 'November 2024',
      diet: 'Standard wet and dry food mix',
      vaccinations: 'Up to date - All core vaccines'
    },
    adoptionFee: 7000,
    requirements: ['Indoor only', 'Patient adopter', 'Time for bonding']
  },
  {
    id: '7',
    name: 'Charlie',
    species: 'dog',
    breed: 'Labrador Retriever',
    age: 5,
    gender: 'male',
    size: 'large',
    color: 'Chocolate',
    location: 'Lahore',
    shelter: {
      name: 'Paws & Claws Rescue',
      phone: '+92 300 1234567',
      email: 'contact@pawsandclaws.org',
      address: '123 Main Street, Lahore',
      website: 'www.pawsandclaws.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800',
    images: [
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Gentle', 'Patient', 'Loving'],
    description: 'Charlie is a mature Labrador with a heart of gold. He is calm, well-mannered, and excellent with children. Charlie loves water and would be thrilled to have a family who enjoys beach trips or swimming. He is the perfect family companion for those wanting a gentle giant.',
    healthHistory: {
      lastVetVisit: 'October 2024',
      diet: 'Senior formula dry food',
      vaccinations: 'Up to date - All required vaccines'
    },
    adoptionFee: 10000,
    requirements: ['Family home', 'Access to outdoor space', 'Love for swimming a plus']
  },
  {
    id: '8',
    name: 'Whiskers',
    species: 'cat',
    breed: 'Siamese',
    age: 3,
    gender: 'female',
    size: 'small',
    color: 'Seal Point',
    location: 'Karachi',
    shelter: {
      name: 'Karachi Cat Sanctuary',
      phone: '+92 321 9876543',
      email: 'info@karachicats.org',
      address: '456 Garden Road, Karachi',
      website: 'www.karachicats.org',
      verified: true
    },
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
      'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800',
      'https://images.unsplash.com/photo-1583795128727-6ec3642b8e27?w=800'
    ],
    vaccinated: true,
    microchipped: true,
    spayedNeutered: true,
    temperament: ['Vocal', 'Social', 'Intelligent'],
    description: 'Whiskers is a talkative Siamese who loves conversation! She is highly intelligent and enjoys puzzle toys and games. Whiskers craves attention and will follow you around, "helping" with whatever you do. She is best suited for someone who works from home or has time to devote to her.',
    healthHistory: {
      lastVetVisit: 'September 2024',
      diet: 'Premium grain-free wet food',
      vaccinations: 'Up to date - FVRCP, Rabies'
    },
    adoptionFee: 9000,
    requirements: ['Experienced cat owner', 'Lots of attention', 'Mental stimulation needed']
  }
];
