import Login from "@/components/features/login/Login";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full flex items-center justify-between flex-col min-h-dvh bg-[#FFDECE] px-6 pt-6">
      <div className="self-end">
        <Login />
      </div>
      <div>
        <img src="/Ivy-logo.png" width={400} />
      </div>
      <div className="self-start w-full">
        <p className="font-regular text-[0.8rem] text-black/40">
          Developed by{" "}
          <a href="http://a2kgroup.org" target="_blank">
            A2K Group Corporation <span> © {currentYear}</span>
          </a>
        </p>
      </div>
    </div>
  );
}
