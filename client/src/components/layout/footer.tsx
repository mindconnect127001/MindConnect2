export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-neutral-500 hover:text-neutral-700">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700">Terms of Service</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700">Contact Us</a>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-neutral-500">© {new Date().getFullYear()} MindConnect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
