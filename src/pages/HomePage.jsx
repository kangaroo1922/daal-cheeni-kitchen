import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Ghar jaisa khana, delivered to your hostel.</h1>
          <p className="lead">Home-style lunches and dinners for university students in H-8 to H-12, G-9 to G-11 and I-8.</p>
          <Link className="btn btn-primary btn-lg" to="/menu">Browse today&apos;s menu</Link>
        </div>
      </section>
    </>
  );
}
