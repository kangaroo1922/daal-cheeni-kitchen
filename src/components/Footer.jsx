import DemoPanel from './DemoPanel.jsx';

export default function Footer({ onReload }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <strong>Daal Cheeni Kitchen</strong> · Pickup: Shop 4, H-11 Markaz, Islamabad · Open 8 am – 10 pm
        </p>
        <p className="muted">Student project (CS4032). Orders on this site are simulated – no food is prepared and no payment is taken.</p>
        <DemoPanel onReload={onReload} />
      </div>
    </footer>
  );
}
