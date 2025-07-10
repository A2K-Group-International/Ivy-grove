import Login from "@/components/features/login/Login";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-dvh flex flex-col relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('../src/assets/images/ivy-grove-architect-perspective.jpeg')]">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
      </div>
      <Login />
      <footer className="p-1 bg-school-600 z-10">
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
