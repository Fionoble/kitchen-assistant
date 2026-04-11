import { LocationProvider, Router, Route } from "preact-iso";
import { Header } from "./components/Header.jsx";
import { BottomNav } from "./components/BottomNav.jsx";
import { Discover } from "./pages/Discover.jsx";
import { Library } from "./pages/Library.jsx";
import { AIChef } from "./pages/AIChef.jsx";
import { RecipeDetail } from "./pages/RecipeDetail.jsx";
import { Profile } from "./pages/Profile.jsx";
import { MealPlans } from "./pages/MealPlans.jsx";

export function App() {
  return (
    <LocationProvider>
      <div class="min-h-dvh flex flex-col">
        <Header />
        <main class="flex-grow pb-24">
          <Router>
            <Route path="/" component={Discover} />
            <Route path="/library" component={Library} />
            <Route path="/chef" component={AIChef} />
            <Route path="/recipe/:id" component={RecipeDetail} />
            <Route path="/profile" component={Profile} />
            <Route path="/meal-plans" component={MealPlans} />
          </Router>
        </main>
        <BottomNav />
      </div>
    </LocationProvider>
  );
}
