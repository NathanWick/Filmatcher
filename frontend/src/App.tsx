import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Temporary mock data
const mockMovies = [
  { id: 1, title: "Jurassic Park", year: 1993, genre: "Action/Sci-Fi", color: "orange", rating: "PG", score: 4.5, description: "Scientists clone dinosaurs to populate a theme park which suffers a major security breakdown." },
  { id: 2, title: "The Matrix", year: 1999, genre: "Sci-Fi/Action", color: "green", rating: "PG", score: 4.6, description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers." },
  { id: 3, title: "Pulp Fiction", year: 1994, genre: "Crime/Drama", color: "purple", rating: "R", score: 4.7, description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption." },
  { id: 4, title: "Back to the Future", year: 1985, genre: "Sci-Fi/Comedy", color: "red", rating: "PG-13", score: 4.8, description: "Marty McFly is sent back in time to 1955, where he meets his future parents and accidentally becomes his mother's romantic interest." },
  { id: 5, title: "The Lion King", year: 1994, genre: "Animation", color: "red", rating: "PG", score: 4.8, description: "Lion prince Simba grows up in the African wilderness after tragedy forces him to run away from home." },
  { id: 6, title: "Forrest Gump", year: 1994, genre: "Drama", color: "green", rating: "PG-13", score: 4.7, description: "The extraordinary life journey of a man with low intelligence who inadvertently influences several historical events." },
  { id: 7, title: "Inception", year: 2010, genre: "Sci-Fi/Action", color: "red", rating: "PG-13", score: 4.7, description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O." },
  { id: 8, title: "Avatar", year: 2009, genre: "Sci-Fi/Action", color: "blue", rating: "PG-13", score: 4.5, description: "A paraplegic Marine dispatched to the moon Pandora becomes torn between following orders and protecting the world he feels is his home." },
  { id: 9, title: "The Dark Knight", year: 2008, genre: "Action/Crime", color: "green", rating: "PG-13", score: 4.9, description: "Batman faces his greatest challenge as the Joker wreaks havoc on Gotham City." },
  { id: 10, title: "Finding Nemo", year: 2003, genre: "Animation", color: "purple", rating: "PG", score: 4.6, description: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home." },
  { id: 11, title: "Interstellar", year: 2014, genre: "Sci-Fi/Drama", color: "blue", rating: "PG-13", score: 4.7, description: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 12, title: "Guardians of the Galaxy", year: 2014, genre: "Action/Sci-Fi", color: "red", rating: "PG-13", score: 4.8, description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe." },
];

// Group movies by genre for shelves
const getMoviesByGenre = () => {
  const genres: Record<string, typeof mockMovies> = {};
  
  mockMovies.forEach(movie => {
    const primaryGenre = movie.genre.split('/')[0];
    if (!genres[primaryGenre]) {
      genres[primaryGenre] = [];
    }
    genres[primaryGenre].push(movie);
  });
  
  return genres;
};

// Update the Movie interface to match your actual data structure
interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  color: string;
  rating: string;
  score: number;
  description: string;
}

interface MascotPosition {
  top: number | null;
  left: number;
}

function MovieItem({ movie, position }: { movie: any; position?: "start" | "middle" | "end" }) {
  return (
    <div className="movie-case" data-position={position || "middle"}>
      <div className="case-cover">
        <div className={`movie-cover ${movie.color}`} data-title={movie.title}></div>
        <div className="movie-rating">{movie.rating}</div>
        <div className="movie-info">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-year">{movie.year}</div>
        </div>
        <div className="price-tag">★ {movie.score}</div>
      </div>
      <div className="case-spine"></div>
      <div className="case-left-side"></div>
      <div className="case-inside">
        <div className="left-page">
          <div className="left-page-content">Movie Info</div>
        </div>
        <div className="right-page">
          <div className="movie-inside">
            <strong className="inside-title">{movie.title}</strong>
            <div className="movie-disc"></div>
            <div className="movie-description">
              {movie.description || "No description available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MovieShelf({ title, movies, viewAllLink, aisleNumber }: { title: string, movies: any[], viewAllLink: string, aisleNumber: number }) {
  return (
    <section className="store-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href={viewAllLink} className="view-all">View All</a>
      </div>
      
      <div className="shelf-container">
        <div className="aisle-label">AISLE {aisleNumber}</div>
        <div className="shelf">
          {movies.map((movie, index) => {
            const position = 
              index === 0 ? "start" : 
              index === movies.length - 1 ? "end" : 
              "middle";
            
            return <MovieItem key={movie.id} movie={movie} position={position} />;
          })}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mascotPosition, setMascotPosition] = useState<MascotPosition>({ top: null, left: 20 });
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mascotTarget, setMascotTarget] = useState({ x: 100, y: 200 });
  const [mascotMessage, setMascotMessage] = useState('');
  const mascotRef = useRef(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Track mouse position with much less frequent updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (Math.random() < 0.005) {
        const randomOffset = {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 300
        };
        
        setMascotTarget({
          x: e.clientX + randomOffset.x,
          y: e.clientY + randomOffset.y
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating animation loop with much slower movement
  useEffect(() => {
    const updateMascotPosition = () => {
      setMascotPosition(prev => {
        const currentTop = prev.top === null ? window.innerHeight / 2 : prev.top;
        const currentLeft = prev.left;
        
        const dx = mascotTarget.x - currentLeft;
        const dy = mascotTarget.y - currentTop;
        
        const time = Date.now() / 5000;
        const floatY = Math.sin(time) * 3;
        const floatX = Math.cos(time * 0.7) * 2;
        
        const newLeft = currentLeft + dx * 0.01 + floatX;
        const newTop = currentTop + dy * 0.01 + floatY;
        
        const boundedLeft = Math.max(50, Math.min(window.innerWidth - 100, newLeft));
        const boundedTop = Math.max(50, Math.min(window.innerHeight - 100, newTop));
        
        return {
          top: boundedTop,
          left: boundedLeft
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(updateMascotPosition);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateMascotPosition);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mascotTarget]);

  // Make sure random movie is set immediately
  useEffect(() => {
    if (mockMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * mockMovies.length);
      setRandomMovie(mockMovies[randomIndex]);
      setMascotMessage(`You might like: "${mockMovies[randomIndex].title}"!`);
    }
    
    const messageInterval = setInterval(() => {
      if (mockMovies.length > 0) {
        const newRandomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
        setRandomMovie(newRandomMovie);
        
        const messages = [
          `You might like: "${newRandomMovie.title}"!`,
          `Have you seen "${newRandomMovie.title}"? It's ${newRandomMovie.score}/5 stars!`,
          `I recommend checking out "${newRandomMovie.title}"!`,
          `Looking for something to watch? Try "${newRandomMovie.title}"!`,
          `"${newRandomMovie.title}" (${newRandomMovie.year}) might be your next favorite!`,
          `Fans of ${newRandomMovie.genre} love "${newRandomMovie.title}"!`,
          `Your perfect weekend movie: "${newRandomMovie.title}"!`
        ];
        
        setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      }
    }, 8000);
    
    return () => clearInterval(messageInterval);
  }, []);

  const handleSectionHover = (e: React.MouseEvent, sectionId: string, sectionMovies: Movie[]) => {
    if (activeRow === sectionId) return;
    
    const section = e.currentTarget;
    const rect = section.getBoundingClientRect();
    
    setMascotTarget({
      x: rect.left + 150,
      y: rect.top + rect.height / 2
    });
    
    setActiveRow(sectionId);
    
    if (sectionMovies.length > 0) {
      const randomSectionMovie = sectionMovies[Math.floor(Math.random() * sectionMovies.length)];
      setRandomMovie(randomSectionMovie);
    }
  };

  return (
    <div className="retro-blockbuster">
      <div className="vhs-effect"></div>
      <div className="tracking-bar"></div>
      <div className="static-overlay"></div>
      
      <div className="store-background"></div>
      
      <header className="sticky-header">
        <div className="header-content cartoon-style">
          <div className="logo-container">
            <div className="logo">filMatcher</div>
            <div className="tag-badge">NEW!</div>
          </div>
          
          <div className="nav-items">
            <a href="#" className="nav-item">Home</a>
            <a href="#" className="nav-item">New Releases</a>
            <a href="#" className="nav-item">Categories</a>
            <a href="#" className="nav-item">My List</a>
            <a href="#" className="nav-item">Recommended</a>
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              className="search-bar"
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      <main>
        <MovieShelf 
          title="Staff Picks" 
          movies={mockMovies.slice(0, 6)} 
          viewAllLink="#"
          aisleNumber={1} 
        />
        
        <MovieShelf 
          title="New Releases" 
          movies={mockMovies.slice(6, 12)} 
          viewAllLink="#"
          aisleNumber={2} 
        />
        
        <div className="store-section">
          <div 
            className="shelf-container"
            onMouseEnter={(e) => handleSectionHover(e, 'new-releases', mockMovies.slice(6, 12))}
          >
            <div className="section-header">
              <h2 className="section-title">New Releases</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="aisle-label">AISLE 1</div>
            <div className="shelf">
              {mockMovies.slice(6, 12).map((movie, index) => {
                const position = 
                  index === 0 ? "start" : 
                  index === 5 ? "end" : 
                  "middle";
                
                return <MovieItem key={index} movie={movie} position={position} />;
              })}
            </div>
          </div>
        </div>
        
        <div className="store-section">
          <div 
            className="shelf-container"
            onMouseEnter={(e) => handleSectionHover(e, 'comedy', mockMovies.filter(m => m.genre.includes('Comedy')))}
          >
            <div className="section-header">
              <h2 className="section-title">Comedy</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="aisle-label">AISLE 2</div>
            <div className="shelf">
              {mockMovies.filter(m => m.genre.includes('Comedy')).map((movie, index, arr) => {
                const position = 
                  index === 0 ? "start" : 
                  index === arr.length - 1 ? "end" : 
                  "middle";
                
                return <MovieItem key={index} movie={movie} position={position} />;
              })}
            </div>
          </div>
        </div>
      </main>
      
      <div className="membership-card">
        <div className="user-icon">M</div>
        <div className="user-info">
          <div className="user-name">Member #2581</div>
        </div>
      </div>
      
      <div className="return-box">
        RETURN BOX
      </div>
      
      <div 
        ref={mascotRef}
        className="clapperboard-mascot" 
        style={{
          left: `${mascotPosition.left}px`,
          top: mascotPosition.top ? `${mascotPosition.top}px` : '50%',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="clapperboard">
          <div className="clapper-top">
            <div className="clapper-stripe"></div>
            <div className="clapper-stripe"></div>
            <div className="clapper-stripe"></div>
          </div>
          <div className="clapper-bottom">
            <div className="mascot-face">
              <div className="mascot-eye"></div>
              <div className="mascot-eye"></div>
              <div className="mascot-smile"></div>
            </div>
          </div>
        </div>
        <div className="speech-bubble">
          {mascotMessage || "Looking for a movie..."}
        </div>
      </div>
      
      <div className="be-kind">BE KIND, REWIND</div>
    </div>
  );
}

export default App;