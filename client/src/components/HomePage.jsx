import React from "react";
import { Link } from "react-router-dom";
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="appbar">
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/applicant/login" className="nav-link">Candidat</Link></li>
            <li><Link to="/admin/login" className="nav-link">Personnel d'admission</Link></li>
          </ul>
        </nav>
      </header>
      
      <main className="home-main">
        <div className="info-cards-container">
          <div className="info-card">
            <h2>Bienvenue sur notre plateforme</h2>
            <p>
              Système de gestion des admissions universitaires - Simplifiez le processus 
              d'admission pour les candidats et les administrateurs.
            </p>
          </div>

          <div className="info-card">
            <h2>Pour les candidats</h2>
            <p>
              Postulez facilement à nos programmes, suivez votre dossier en temps réel 
              et communiquez avec le service des admissions.
            </p>
            <Link to="/applicant/login" className="card-button">
              Commencer ma candidature
            </Link>
          </div>

          <div className="info-card">
            <h2>Pour le personnel</h2>
            <p>
              Gestion centralisée des dossiers, outils de collaboration et tableau 
              de bord complet pour le processus d'admission.
            </p>
            <Link to="/admin/login" className="card-button">
              Accéder au panel admin
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;