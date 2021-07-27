import { format, fromUnixTime } from "date-fns";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup, TileLayer, MapContainer } from "react-leaflet";
import "./App.css";

function App() {
  const [message, setMessage] = useState();
  const [date, setDate] = useState<string>("");
  const [position, setPosition] = useState({ longitude: 0, latitude: 0 });
  const [current, setCurrent] = useState<LatLngExpression>([0, 0]);
  const standardFormat = "eeee, do MMM yyyy, kk:mm:ss zzzz";

  useEffect(() => {
    fetch("http://api.open-notify.org/iss-now.json").then(async (res) => {
      const { message, timestamp, iss_position } = await res.json();

      // message
      setMessage(message);

      // date
      const date: Date = fromUnixTime(timestamp);
      setDate(format(date, standardFormat));

      // position
      const position = {
        longitude: iss_position.longitude,
        latitude: iss_position.latitude,
      };
      setPosition(position);
    });
  }, []);

  useEffect(() => {
    if (position.longitude && position.latitude) {
      setCurrent([position.longitude, position.latitude]);
    }
  }, [position]);

  return (
    <div className="App">
      <h1>International Space Station tracker</h1>
      {message === "success" ? (
        <div>
          <h3>{date}</h3>
          <MapContainer
            style={{ marginTop: "60px" }}
            key={`${position.longitude}-${position.latitude}`}
            center={current}
            zoom={0}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={current}>
              <Popup>ISS current location</Popup>
            </Marker>
          </MapContainer>
          <a
            href="https://github.com/jingxian01/iss-tracker"
            target="_blank"
            rel="noreferrer"
          >
            <button style={{ marginTop: "20px" }}>GitHub Repository</button>
          </a>
        </div>
      ) : (
        <div>loading ... </div>
      )}
    </div>
  );
}

export default App;
