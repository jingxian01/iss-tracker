import { format, fromUnixTime } from "date-fns";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";

function App() {
  const [date, setDate] = useState<string>("");
  const [position, setPosition] = useState<LatLngExpression>([0, 0]);
  const standardFormat = "eeee, do MMM yyyy, kk:mm:ss zzzz";

  useEffect(() => {
    fetch("https://api.wheretheiss.at/v1/satellites/25544").then(
      async (res) => {
        const { timestamp, latitude, longitude } = await res.json();
        // date
        const date: Date = fromUnixTime(timestamp);
        setDate(format(date, standardFormat));

        // position
        if (longitude && latitude) {
          setPosition([latitude, longitude]);
        }
      }
    );
  }, []);

  return (
    <div className="App">
      <div className="box">
        <h1>International Space Station tracker</h1>
      </div>
      <div>
        {date ? (
          <div>
            <h3>{date}</h3>
            <p style={{ color: "gray" }}>
              [latitude, longitude] = {position.toString()}
            </p>
            <MapContainer
              style={{ marginTop: "40px" }}
              center={position}
              zoom={0}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>ISS current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div>loading ... </div>
        )}

        <div className="icon">
          <a
            href="https://github.com/jingxian01/iss-tracker"
            target="_blank"
            rel="noreferrer"
          >
            <button className="btn">
              <GoMarkGithub size="2em" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
