import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Alineacion from "./pages/Alineacion";
import Statistics from "./pages/Statistics";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import { Navigation } from "./components/Navigation";
import { Player } from "./types/player";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();
const STORAGE_KEY = 'football-manager-players';

const App = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEY);
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
        if (Array.isArray(parsedPlayers)) {
          setPlayers(parsedPlayers);
          console.log('Jugadores cargados desde localStorage:', parsedPlayers);
          toast({
            title: "Jugadores cargados",
            description: "Se han recuperado los jugadores guardados",
          });
        }
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
        toast({
          title: "Error al cargar jugadores",
          description: "Hubo un error al cargar los jugadores guardados",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleUpdatePlayerName = (playerId: string, name: string) => {
    setPlayers(prev => {
      const newPlayers = prev.map(p => 
        p.id === playerId ? { ...p, name } : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers));
      console.log('Nombre de jugador actualizado:', { playerId, name, newPlayers });
      return newPlayers;
    });
  };

  const handleUpdatePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers));
    console.log('Lista de jugadores actualizada:', newPlayers);
    toast({
      title: "Jugadores guardados",
      description: "Los cambios han sido guardados correctamente",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  players={players}
                  onUpdatePlayers={handleUpdatePlayers}
                  onUpdatePlayerName={handleUpdatePlayerName}
                />
              } 
            />
            <Route 
              path="/alineacion" 
              element={
                <Alineacion 
                  players={players}
                  onUpdatePlayers={handleUpdatePlayers}
                  onUpdatePlayerName={handleUpdatePlayerName}
                />
              } 
            />
            <Route 
              path="/estadisticas" 
              element={
                <Statistics 
                  players={players}
                  onUpdatePlayerName={handleUpdatePlayerName}
                />
              } 
            />
            <Route 
              path="/partidos" 
              element={<Matches />} 
            />
            <Route 
              path="/partidos/:id" 
              element={
                <MatchDetail 
                  players={players}
                  onUpdatePlayers={handleUpdatePlayers}
                />
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;