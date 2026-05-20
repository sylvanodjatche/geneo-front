function About() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">À propos de GENEo</h1>
      <p className="text-gray-600 mb-3">
        Application développée dans le cadre du Master 1 Data Science (UE 4258) – Université de Yaoundé I.
      </p>
      <p className="text-gray-600 mb-3">
        Modèle GCN (Graph Convolutional Network) entraîné sur la compétition <strong>CAFA 6</strong> (Critical Assessment of Functional Annotation).
      </p>
      <p className="text-gray-600 mb-3">
        Frontend : React + Vite + Tailwind CSS<br />
        Backend : FastAPI<br />
        Inférence : PyTorch + ESM-2 + GCN
      </p>
      <p className="text-gray-500 text-sm mt-6">
        © 2026 – Équipe GENEo (GOUJOU, DJATCHE, TAGNE)
      </p>
    </div>
  );
}
export default About;