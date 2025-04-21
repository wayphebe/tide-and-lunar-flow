
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "./LocationSelector";
import { MoonIcon } from "./icons/MoonIcon";

const Header = () => {
  return (
    <header className="border-b border-border/40 backdrop-blur-md bg-ocean-dark/60 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <MoonIcon className="w-8 h-8 text-moon-dark" />
            <div className="absolute inset-0 animate-pulse-subtle">
              <div className="moon-glow"></div>
            </div>
          </div>
          <span className="font-semibold text-xl">月相-潮汐</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <LocationSelector />
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/">日历</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to={`/moon/${new Date().toISOString().split('T')[0]}`}>月相</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to={`/tide/${new Date().toISOString().split('T')[0]}`}>潮汐</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
