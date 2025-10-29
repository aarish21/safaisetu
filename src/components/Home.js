import Hero from "./Hero";
import DashboardMetrics from "./DashboardMetrics";

function Home() {
  return (
    <>
    <div style={{
      background: 'linear-gradient(135deg, #d7aa25ff, #448fadff)',
      color: 'white',
      padding: '100px 0',
      textAlign: 'center'
    }}>
        <Hero />
        <DashboardMetrics />
    </div>
      
    </>
  );
}

export default Home;
