// /*
// * Use under_score pattens to name database model properties
// */

// Ajust propertins name patterns!!!!!!!!
export const Profile = () => {
 return {
    uid: "",
    nickname: "",
    first_name: "",
    last_name: "",
    about: "I am a good person.",
    image: "/public/assets/images/avatar-v1.png",
    email: "",
    location: {},
    addresses: [ProfileAddress],
    short_profile: ShortProfile,
    languages: [],
    currency: [],
    balance_account: 0,
    favorites: [],
    reviews: [],
    messages: [],
    verified_info: [],
    seller_profile: false,
    created_at: Date.now()
  };
}

export const ShortProfile = {
  username: "",
  image: "./assets/images/profile/default-avatar.png",
  email: ""
};

export const ProfileAddress = {
  full_name: "",
  street_1: "",
  street_2: "",
  city: "",
  state: "",
  zip_code: "",
  phone: "",
  country: "",
  primary: false
};

export const Wallet = () => {
  return {
    bitcoin_account: {
      transactions: []
    },
    ethereum_account: {},
    litecoin_account: {},
    status: "created"
  }
};

