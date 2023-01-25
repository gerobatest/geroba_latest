import React, {useState} from 'react';
import '../style/Footer.scss';
import {AiTwotoneHome} from 'react-icons/ai';
import {GiRotaryPhone} from 'react-icons/gi'; 
import {MdEmail} from 'react-icons/md';
import {FaGlobe} from 'react-icons/fa';
import { useEffect } from "react";

import Map from "./Map/Map";
import Layers from "./Map/Layers";
import TileLayer from "./Map/TileLayer";
import VectorLayer from "./Map/VectorLayer";
import osm from "./Map/osm";
import vector from "./Map/vector";
import Controls from "./Map/Controls";
import FullScreenControl from "./Map/FullScreenControl";
import { Circle as CircleStyle,Style } from 'ol/style';
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import mapConfig from "../config.json";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon} from 'ol/style';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const iconFeature = new Feature({
  geometry: new Point([1.25364, 44.41486]),
  name: '81 rue du Moulin, 46140 SAUZET, France'
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: '/location.png',
    scale: 1.5
  }),
});
iconFeature.setStyle(iconStyle);
const geojsonObject2 = mapConfig.geojsonObject2;

function Footer() {
  useEffect(() => {
    const margin = getComputedStyle(document.documentElement).getPropertyValue('--contactInfo-marginTop');
}, []);


function setMargin (newMargin){
  document.documentElement.style.setProperty('--contactInfo-marginTop', newMargin);
}

  const [center, setCenter] = useState([1.25364, 44.41480]); //le centre de la carte après chargement
  const [zoom, setZoom] = useState(18.5)
  const [showLayer2, setShowLayer2] = useState(true);
  const [showCancelButton, setShowCancelButton] = useState(false); //Bouton annuler
  const [showSendButton, setShowSendButton] = useState(false);  //Bouton envoyer 
  const [error, setError] = useState(null); //feedback form

  //Les valeurs depuis la forme
  const [formVal, setFormVal] = useState({
    name:'',
    fname:'',
    email:'',
    message:'',
    mailSent: false, 
    error: null
  });

  const handleChange = (e) => {
    const {name,value} = e.target
    setMargin('120px')
    setFormVal(prevState=>{
      setShowCancelButton(true)
      if (value === '')
        setShowSendButton(false)
      return {
      ...prevState,[name]:value
    }})
    let all_filled = true
    Object.values(formVal).forEach((item)=>{
      if (item === '')
      {
        all_filled = false
      }
    })
    if (all_filled)
    {
      setShowSendButton(true)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const settings = {
      name: formVal.name, 
      fname: formVal.fname,
      mail: formVal.email,
      message: formVal.message
    }

    const messageobj = `Contact site GEROBA de ` + settings.fname + ` ` + settings.name;
    const messagecontent = settings.mail + `: ` + settings.message;

    axios.get(`https://www.gerobamaster.fr/sendMail?to=contact@geroba.fr&obj=` + messageobj + `&message= ` + messagecontent)
      .then(res => {
        if (res.status === 200)
          toast.success("Message envoyé avec succès!")
      })
      .catch((error)=> {
        if(error.response)
          toast.error("Erreur! Message non envoyé.")
      })
    
    cancelForm();
  }

  //Efface tous les champs 
  const cancelForm = () =>{
    setMargin('0px')
    setShowCancelButton(false)
    setShowSendButton(false)
    setFormVal({
      name:'',
      fname:'',
      email:'',
      message:''
    })
    document.getElementById("contact-form").reset();
  };


  //mois actuel
  const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
  const currentMonthNum = new Date().getMonth();
  const currentMonth = MONTHS[currentMonthNum];

  //année actuelle 
  const currentYear =  new Date().getUTCFullYear();

  return (
      <div className="footer" id="contact">
        <div className="footerRow1">
          {/*La carte*/}
          <div className="map" id="map">
            <Map center={fromLonLat(center)} zoom={zoom}>
              <Layers>
                <TileLayer
                  source={osm()}
                  zIndex={0}
                />
                {showLayer2 && (
                  <VectorLayer
                    source={vector({ features: new GeoJSON().readFeatures(geojsonObject2, { featureProjection: get('EPSG:3857') }) })}
                    style={iconStyle}
                  />
                )}
              </Layers>
              <Controls>
                <FullScreenControl />
              </Controls>
            </Map>
            <div>
          </div>
          </div>
          <div className="contact-container">
            <ToastContainer position="bottom-center" limit={1}/>
            <h1 className="title" > 
              Contactez-nous
            </h1> 
            <form id="contact-form" onSubmit={submitHandler}>
              {/* Prénom */}
              <div>
                <input 
                  type="text" 
                  id="fname" 
                  name="fname" 
                  defaultValue={formVal.fname} 
                  onChange={handleChange} 
                  required="required"
                  />
                <span className="floating-label">Prénom<span className="star">*</span></span>
              </div>
              {/* Nom */}
              <div>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  defaultValue={formVal.name} 
                  onChange={handleChange} 
                  required="required"
                />
                <span className="floating-label">Nom<span className="star">*</span></span>
              </div>
              {/* Email */}
              <div>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  defaultValue={formVal.email} 
                  onChange= {handleChange} 
                  required="required"
                  />
                <span className="floating-label">Email<span className="star">*</span></span>
                {error && <h2 style={{color: 'red'}}>{error}</h2>}
              </div>
              {/* Message */}
              <div>
                <textarea
                  name='message' 
                  placeholder=" " 
                  onChange={handleChange} 
                  required="required"
                  />
                <span className="floating-label message" >Message</span>
              </div>
              <div className="form-btn">
                {showCancelButton && (
                  <button onClick={cancelForm} type="button">
                    ANNULER
                  </button>
                )}
                {showSendButton && (
                <button
                  type="submit">
                  ENVOYER
                </button>
                )}
              </div>
            </form>
            <div className="contact-info">
              <p><AiTwotoneHome color="#F15a22"/> : 81 rue du Moulin, 46140 SAUZET, France.</p>
              <p><GiRotaryPhone color="#F15a22"/> : <a href="tel:+33 (0) 6 31 89 80 34">+33 (0) 6 31 89 80 34</a></p>
              <p><MdEmail color="#F15a22"/> : <a href="mailto:contact@gerobamaster.fr">contact@gerobamaster.fr</a></p>
              <p><FaGlobe color="#F15a22"/> : <a href="/">www.geroba.fr</a></p>
            </div>
          </div>
        </div>

        <div className="footerRow2">
            <p><i>Conçu et développé par  &nbsp;&nbsp; <img className="footerLogo" src="gerobaFooter.jpg" alt="gds group"></img> &nbsp;&nbsp; Tous droits réservés &copy; {} {currentMonth} {currentYear}</i></p>
        </div>
      </div>   
)}
export default Footer;