/**
 * Test frontend : affichage des données au survol / clic
 */

import { render, screen } from "@testing-library/react";
import Accueil from "../pages/Accueil";

describe("Test frontend - Carte mondiale", () => {
  test("Affichage du titre principal", () => {
    render(<Accueil />);
    const title = screen.getByText(/Carte mondiale du COVID-19/i);
    expect(title).toBeInTheDocument();
  });

  test("Instruction affichée avant sélection", () => {
    render(<Accueil />);
    const message = screen.getByText(/Sélectionnez un pays/i);
    expect(message).toBeInTheDocument();
  });
});
