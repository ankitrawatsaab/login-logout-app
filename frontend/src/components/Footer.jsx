
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AuthApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
