export const Base_Url = "https://upskilling-egypt.com:3000/api/v0";
export const Base_Img_Url = "https://upskilling-egypt.com:3000/";

const Base_Users = `${Base_Url}/portal/users`;
const Base_Ads = `${Base_Url}/admin/ads`;

export const User_URls = {
  login: `${Base_Users}/Login`,
  register: `${Base_Users}`,
  forgetPassword: `${Base_Users}/forgot-password`,
  resetPassword: `${Base_Users}/reset-password`,
  changePassword: `${Base_Users}/change-password`,
};

export const Ads_URls = {
  gitAds: `${Base_Ads}`,
  deleteAds: (id: string): string => `${Base_Ads}/${id}`,
};
const Base_facilities=`${Base_Url}/admin`
export const facility_Urls={
getAllFacility:`${Base_facilities}/room-facilities`,
createFacility:`${Base_facilities}/room-facilities`,

}
