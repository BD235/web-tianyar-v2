import WelcomeClient from "./WelcomeClient";

const DESKTOP_IMAGE = "https://esurvszclaudbtvxiytf.supabase.co/storage/v1/object/public/wisata-images/welcome-desktop-d567e782-2551-45e5-823d-7ff8a3155f8d.jpg";
const MOBILE_IMAGE = "https://esurvszclaudbtvxiytf.supabase.co/storage/v1/object/public/wisata-images/welcome-desktop-d567e782-2551-45e5-823d-7ff8a3155f8d.jpg";

export default function WelcomePage() {
  return (
    <WelcomeClient
      desktopImage={DESKTOP_IMAGE}
      mobileImage={MOBILE_IMAGE}
    />
  );
}
