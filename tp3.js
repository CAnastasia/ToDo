////////////////////////////////////////

function trie_articles_date(nouvelles) {
  const res = Array.from(nouvelles);
  res.sort((n1, n2) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0);
  return res;
}

////////////////////////////////////////

function formate_titre(nvl) {
  return `<li id="${nvl.idx_li}">${nvl.nouvelle.date}: ${nvl.nouvelle.titre}<div id="${nvl.idx_ctn}"><p>${nvl.nouvelle.contenu}</p></div></li>`;
}

////////////////////////////////////////

function liste_nouvelles_html(ids_nouvelles) {
  const nouvelles_html = ids_nouvelles
        .map(formate_titre)
        .join('\n');
  return `<ul>\n${nouvelles_html}</ul>\n`;
}

////////////////////////////////////////////////////////////

function filtre_mois_annee(nouvelles, mois, annee) {
  return nouvelles.filter(function(n) {
    const splitted_date = n.date.split('-').map(Number);
    const a = splitted_date[0];
    const m = splitted_date[1];
    return !isNaN(a) && !isNaN(m)
      && a === Number(annee) && m === Number(mois);
  });
}

function liste_to_options(valeurs) {
  const options = valeurs
        .map((v,i) => `  <option value="${v}" ${i === 0 ? 'selected="true"' : ''}>${v}</option>`)
        .join('\n')
  return `${options}`;
}

function maj_liste_nouvelles2(nouvelles, mois, annee) {
  const filtrees = filtre_mois_annee(nouvelles, mois, annee);
  const ids_et_nouvelles = filtrees
        .map( (nlle, idx) => ({
          "idx_li": `li-${idx}`,
          "idx_ctn": `ctn-${idx}`,
          "nouvelle": nlle
        }));
  const liste_html = liste_nouvelles_html(ids_et_nouvelles);
  document.getElementById("elt-nouvelles").innerHTML = liste_html;
  // enregistrement des callbacks d'affichage/masquage lors d'un click sur un titre
  ids_et_nouvelles.forEach(function(nlle) {
    const a_cacher = ids_et_nouvelles
          .filter(n => n.idx_ctn != nlle.idx_ctn)
          .map(n => n.idx_ctn);
    const a_montrer = nlle.idx_ctn;
    document.getElementById(nlle.idx_li).onclick =
      (() => masque_affiche_contenus(a_cacher, a_montrer));
  });
  // Masquer tous les contenus par dÃ©faut
  ids_et_nouvelles.forEach(function(nlle) {
    document.getElementById(nlle.idx_ctn).style.display = "none";
  });
}

function elimine_doublons_trie(liste) {
  const asSet = new Set(liste);
  let asTab = Array.from(asSet.values());
  asTab.sort();
  return asTab;
}

function mois_de_annee(nouvelles, annee) {
  const nAnnee = Number(annee);
  let filtered = nouvelles
        .map(n => n.date)
        .map(d => d.split("-"))
        .filter(dl => Number(dl[0]) === nAnnee)
      .map(dl => dl[1]); // le mois
  return elimine_doublons_trie(filtered);
}

function maj_mois(nouvelles, annee) {
  const mois_annee = mois_de_annee(nouvelles, annee);
  const select = document.getElementById("select-mois");
  select.innerHTML = liste_to_options(mois_annee)
  maj_liste_nouvelles2(nouvelles, select.value, annee);
}

function annees(nouvelles) {
  return elimine_doublons_trie(
    nouvelles
      .map(n => n.date.split('-')[0])
  );
}

function maj_annees(nouvelles) {
  const annee_html = liste_to_options(annees(nouvelles));
  document.getElementById("select-annee").innerHTML = annee_html;
  document.getElementById("select-annee").onchange = (() => change_annee(nouvelles));
  document.getElementById("select-mois").onchange = (() => change_mois(nouvelles));
  change_annee(nouvelles);
}

function change_annee(nouvelles) {
  const annee = document.getElementById("select-annee").value;
  maj_mois(nouvelles, annee);
}

function change_mois(nouvelles) {
  const mois = document.getElementById("select-mois").value;
  const annee = document.getElementById("select-annee").value;
  maj_liste_nouvelles2(nouvelles, mois, annee);
}


function masque_affiche_contenus(id_contenus, id_contenu_a_afficher) {
  id_contenus.forEach(function(idc) {
    document.getElementById(idc).style.display = "none";
  });
  document.getElementById(id_contenu_a_afficher).style.display = "block";
}

// Fonction qui crÃ©Ã©e le menu des annuaires
// et y ajoute la fonction de changement de liste de nouvelles
function maj_annuaire(annuaireData) {
  const annuaireAndIds = annuaireData
        .map((desc,idx) => ({
          "titre": desc.titre,
          "url": desc.url,
          "id": `ann-${idx}`
        }));
  const annuaireDict =
        annuaireAndIds.reduce(function(acc,desc) {
          acc[desc.id] = desc;
          return acc;
        }, {});
  document.getElementById("select-nouvelles").innerHTML =
    `<option value="none" selected="true">Choisir une liste de nouvelles</option>\n`+
    annuaireAndIds
    .map( desc => `<option value="${desc.id}">${desc.titre}</option>` )
    .join('\n');
  document.getElementById("select-nouvelles").onchange =
    function() {
      const lid =   document.getElementById("select-nouvelles").value;
      fetch(annuaireDict[lid].url)
        .then(response => response.text(), function(erreur) {
          document.getElementById("elt-erreur").innerHTML = `<p>Erreur de chargement pour ${annuaireDict[lid].url}: ${erreur}</p>`;
        })
        .then(function(data) {
          maj_annees(trie_articles_date(JSON.parse(data)));
          document.getElementById("elt-erreur").innerHTML = "";
        }, function(erreur) {
          document.getElementById("elt-erreur").innerHTML = `<p>Erreur de chargement pour ${annuaireDict[lid].url}: ${erreur}</p>`;
        });
    };
}


// Fonction qui charge les donnÃ©es de l'annuaire et met en place le menu correspondant
function charge_annuaire() {
  fetch('annuaire.json')
    .then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        document.getElementById("elt-erreur").innerHTML = `<p>Erreur de chargement pour annuaire.json: ${response.text()}</p>`;
      }}, function(error) {
        document.getElementById("elt-erreur").innerHTML = `<p>Erreur de chargement pour annuaire.json: ${error}</p>`;
      })
    .then(function(data) {
      json = JSON.parse(data);
      maj_annuaire(json);
    }, function(error) {
      document.getElementById("elt-erreur").innerHTML = `<p>Erreur de chargement pour annuaire.json: ${error}</p>`;
    });
}


// Fonction appelÃ©e une fois la page HTML chargÃ©e
function init_menus() {
  console.log("Initialisation des menus de selection d'annÃ©e/mois");
  /*chargeDonnees("nouvelles.json", function(data) {
    const jData = JSON.parse(data)
    maj_annees(trie_articles_date(jData));
    });*/
  charge_annuaire();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Fonction permettant de charger des donnÃ©es depuis une ressource sÃ©parÃ©e
function chargeDonnees(url, callback) {
  fetch(url)
    .then(response => response.text())
    .then(data => callback(data)); // on pourrait faire Ã©galement .then(callback)
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Code permettant d'utiliser les fonctions ci-dessus dans la page LIFAP5-TP3.html
document.addEventListener('DOMContentLoaded', function(){


  if (document.getElementById("title-test-tp3") == null) { // garde pour ne pas exÃ©cuter dans la page des tests unitaires.

    init_menus();

  }

}, false);
