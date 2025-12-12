// ui.js
(function () {
    function bindSliderValues() {
      const sliderPairs = [
        ["likeMe","val_likeMe"],
        ["faceAttract","val_face"],
        ["bodyAttract","val_body"],
        ["positivity","val_positivity"],
        ["kindness","val_kindness"],
        ["humor","val_humor"],
        ["conversation","val_conversation"],
        ["hobbiesGames","val_games"],
        ["hobbiesGym","val_gym"],
        ["emotionalCuriosity","val_emotionalCuriosity"],
        ["intCuriosity","val_intCurious"],
        ["futchFactor","val_futch"],
        ["hobbiesNiche","val_niche"],
        ["foodPref","val_food"],
        ["education","val_education"],
        ["wealth","val_wealth"],
        ["swag","val_swag"],
  
        ["chalantness","val_chalant"],
        ["shyGreg","val_shyGreg"],
        ["introExtro","val_introExtro"],
        ["stemVibes","val_stem"],
        ["agency","val_agency"],
  
        ["bodyLanguage","val_bodyLang"],
        ["voice","val_voice"],
        ["manners","val_manners"],
        ["style","val_style"],
        ["puppyFactor","val_puppy"],
  
        ["religion","val_religion"],
        ["douchiness","val_douchiness"],
        ["promiscuity","val_promisc"],
        ["econ","val_econ"],
        ["social","val_social"],
        ["gutOverride","val_gut"],
      ];
  
      sliderPairs.forEach(([id, label]) => {
        const input = document.getElementById(id);
        const out = document.getElementById(label);
        if (!input || !out) {
          console.warn("Missing slider or label:", { id, label, input, out });
          return;
        }        
  
        out.textContent = input.value;
        input.addEventListener("input", () => (out.textContent = input.value));
      });
    }
  
    function initHeightDropdown() {
      const inchesSelect = document.getElementById("heightInches");
      if (!inchesSelect) return;
  
      inchesSelect.innerHTML = "";
      for (let i = 0; i <= 11; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        inchesSelect.appendChild(opt);
      }
      inchesSelect.value = 10;
    }
  
    function drawCompass() {
      const canvas = document.getElementById("politicalCompass");
      if (!canvas) return;
    
      const econEl = document.getElementById("econ");
      const socialEl = document.getElementById("social");
      if (!econEl || !socialEl) return;
    
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
    
      ctx.clearRect(0, 0, w, h);
    
      ctx.globalAlpha = 0.20;
      ctx.fillStyle = "#e8c9c7"; ctx.fillRect(0, h/2, w/2, h/2);
      ctx.fillStyle = "#f1d98f"; ctx.fillRect(w/2, h/2, w/2, h/2);
      ctx.fillStyle = "#d4e3e0"; ctx.fillRect(0, 0, w/2, h/2);
      ctx.fillStyle = "#f18952"; ctx.fillRect(w/2, 0, w/2, h/2);
      ctx.globalAlpha = 1.0;
    
      ctx.strokeStyle = "#e8c9c7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
      ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
      ctx.stroke();
    
      const econ = parseInt(econEl.value, 10) / 100;
      const social = parseInt(socialEl.value, 10) / 100;
    
      const x = (econ + 1) / 2 * w;
      const y = (1 - (social + 1) / 2) * h;
    
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }    
  
    function wireButtons() {
      const runBtn = document.getElementById("runButton");
      const dlBtn = document.getElementById("downloadButton");
      const detailsBtn = document.getElementById("toggleDetails");
      const detailsBox = document.getElementById("detailsBox");
  
      if (runBtn) {
        runBtn.addEventListener("click", (e) => {
          if (typeof window.runDecision !== "function") {
            console.error("runDecision is not defined. Check engine.js load/errors.");
            return;
          }
          window.runDecision(e);
        });
      }
      
      if (dlBtn) {
        dlBtn.addEventListener("click", (e) => {
          if (typeof window.downloadLog !== "function") {
            console.error("downloadLog is not defined. Check engine.js load/errors.");
            return;
          }
          window.downloadLog(e);
        });
      }      
  
      if (detailsBtn && detailsBox) {
        detailsBtn.addEventListener("click", () => {
          const isHidden = detailsBox.style.display === "none" || !detailsBox.style.display;
          detailsBox.style.display = isHidden ? "block" : "none";
          detailsBtn.textContent = isHidden ? "hide those crazy ass numbers" : "show details";
          detailsBtn.style.background = isHidden ? "#444" : "#111";
        });
      }
    }
  
    function wireCompass() {
      const econ = document.getElementById("econ");
      const social = document.getElementById("social");
      if (econ) econ.addEventListener("input", drawCompass);
      if (social) social.addEventListener("input", drawCompass);
      drawCompass();
    }
  
    function cursorFX() {
      const flower = document.getElementById("cursorFlower");
      const glow = document.getElementById("cursorGlow");
      if (!flower || !glow) return;
  
      let mouseX = 0, mouseY = 0;
      let flowerX = 0, flowerY = 0;
      let glowX = 0, glowY = 0;
  
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
  
      function animate() {
        const speed = 0.12;
        flowerX += (mouseX - flowerX) * speed;
        flowerY += (mouseY - flowerY) * speed;
        flower.style.left = flowerX + "px";
        flower.style.top = flowerY + "px";
  
        const glowSpeed = 0.25;
        glowX += (mouseX - glowX) * glowSpeed;
        glowY += (mouseY - glowY) * glowSpeed;
        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";
  
        requestAnimationFrame(animate);
      }
      animate();
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      initHeightDropdown();
      bindSliderValues();
      wireButtons();
      wireCompass();
      cursorFX();
    });
  })();
  
