import Login from "@/components/features/login/Login";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-school-50 to-school-100 flex flex-col">
      <Login />
      <footer className="p-1 bg-school-600">
        <p className="font-regular text-[0.8rem] text-center md:text-start text-white/80">
          Developed by{" "}
          <a href="http://a2kgroup.org" target="_blank">
            A2K Group Corporation <span> © {currentYear}</span>
          </a>
        </p>
      </footer>
    </div>
  );
}
