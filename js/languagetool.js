var regles_amb_radio = Array('opcio_general', 'incoatius', 'incoatius2', 'demostratius', 'accentuacio', 'concorda_dues', 
   'municipis', 'variant', 'apostrof', 'guio', 'guiopera', 'interrogant', 'exclamacio', 'percent');
var regles_amb_checkbox = Array('recomana_preferents', 'evita_colloquials', 'espais_blancs', 'prioritza_cometes', 'tres_punts');


(function($) {
    $(document).ready(function() {
        readCookieStatus();
        //update_enabled_rules();
        doit();
    });
}(jQuery));

function doit() {
    saveCookieStatus();
    update_enabled_rules();

    // opcions valencià (ca-ES-valencia)
    var disabledRules = [];
    var enabledRules = [];
    var disabledCategories = [];

    // opcions general (ca-ES)
    var ca_disabledRules = [];
    var ca_enabledRules = []; 
    var ca_disabledCategories = []; 

    //Opcions de tipografia
    var typo_enabledRules = [];
    var typo_disabledRules = [];

    if ($("input[name=opcio_general]:checked").val() == "criteris_gva") { 

        disabledRules.push("PERCENT_SENSE_ESPAI","AL_INFINITIU","EVITA_INFINITIUS_INDRE","ORTO_IEC2017","CA_SIMPLE_REPLACE_DNV");

        enabledRules.push("PRE_IEC2017","LEXIC_VAL","VERBS_I_ANTIHIATICA","EVITA_AQUEIX_EIXE","PREFERENCIES_VERBS_VALENCIANS","NUMERALS_VALENCIANS","PARTICIPIS_IT","ORDINALS_E","EXIGEIX_PLURALS_SCOS","EXIGEIX_PLURALS_JOS","EXIGEIX_PLURALS_S","EXIGEIX_INFINITIUS_INDRE","EXIGEIX_INFINITIUS_ALDRE","EXIGEIX_US,HUI");

        disabledCategories.push("DNV_PRIMARY_FORM");       

    } else if ($("input[name=opcio_general]:checked").val() == "criteris_uv") {
        disabledRules.push("ORTO_IEC2017","EXIGEIX_ACCENTUACIO_VALENCIANA");

        enabledRules.push("PRE_IEC2017","VERBS_I_ANTIHIATICA","EVITA_AQUEIX_EIXE","PREFERENCIES_VERBS_VALENCIANS","PARTICIPIS_IT","ORDINALS_E","EXIGEIX_PLURALS_SCOS","EXIGEIX_PLURALS_JOS","EXIGEIX_PLURALS_S","EXIGEIX_INFINITIUS_ALDRE","EXIGEIX_US","EXIGEIX_ACCENTUACIO_GENERAL","EXIGEIX_TENIR_VENIR","LEXIC_VAL","NUMERALS_GENERALS","AVUI","PREFERENCIES_LEXIC_UNIVERSITATS");

        
    } else {
        //disabledRules = disabledRules + ",VULLGA,AHI"; //acceptat per AVL no Generalitat

        /* incoatius -eix/-ix */
        if ($("input[name=incoatius]:checked").val() == "incoatius_ix") {
            enabledRules.push("EXIGEIX_VERBS_IX");
            disabledRules.push("EXIGEIX_VERBS_EIX");
        };
        /* incoatius -esc/-isc */
        if ($("input[name=incoatius2]:checked").val() == "incoatius_esc") {
            enabledRules.push("EXIGEIX_VERBS_ESC");
            disabledRules.push("EXIGEIX_VERBS_ISC");
        };
        /* demostratius aquest/este */
        if ($("input[name=demostratius]:checked").val() == "demostratius_este") {
            enabledRules.push("EVITA_DEMOSTRATIUS_AQUEST");
            disabledRules.push("EVITA_DEMOSTRATIUS_ESTE");
        };
        /* accentuació café /cafè */
        if ($("input[name=accentuacio]:checked").val() == "accentuacio_general") {
            enabledRules.push("EXIGEIX_ACCENTUACIO_GENERAL");
            disabledRules.push("EXIGEIX_ACCENTUACIO_VALENCIANA");
        };
        /* concordança dos/dues */
        if ($("input[name=concorda_dues]:checked").val() == "concorda_dos") {
            enabledRules.push("CONCORDANCES_NUMERALS_DOS");
            disabledRules.push("CONCORDANCES_NUMERALS_DUES");
        };
    }

    /* municipis nom valencià/oficial */
    if ($("input[name=municipis]:checked").val() == "municipi_nom_oficial" && $("input[name=opcio_general]:checked").val() != "criteris_uv") {
        enabledRules.push("MUNICIPIS_OFICIAL");
        disabledRules.push("MUNICIPIS_VALENCIA");
    };

    // paraules preferents
    if (!$("input[name=recomana_preferents]:checked").val()) {
        disabledCategories.push("DNV_SECONDARY_FORM");
        disabledRules.push("CA_SIMPLE_REPLACE_DNV_SECONDARY");
    };
    // terminació -iste
    if (!$("input[name=recomana_preferents]:checked").val() &&
        $("input[name=opcio_general]:checked").val() == "criteris_cap") {
        disabledRules.push("EVITA_ISTE");
    }
    // paraules col·loquials
    if (!$("input[name=evita_colloquials]:checked").val()) {
        disabledCategories.push("DNV_COLLOQUIAL");
        disabledRules.push("CA_SIMPLE_REPLACE_DNV_COLLOQUIAL");
    };

    if ($("input[name=apostrof]:checked").val() == "apostrof_tipografic") {typo_enabledRules.push("APOSTROF_TIPOGRAFIC","COMETES_TIPOGRAFIQUES"); };
    if ($("input[name=apostrof]:checked").val() == "apostrof_recte") {typo_enabledRules.push("APOSTROF_RECTE","COMETES_RECTES"); };
    if ($("input[name=guio]:checked").val() == "guio_llarg") {typo_enabledRules.push("GUIO_LLARG"); };
    if ($("input[name=guio]:checked").val() == "guio_mitja") {typo_enabledRules.push("GUIO_MITJA"); };
    if ($("input[name=guiopera]:checked").val() == "guiopera_dialegs") {typo_enabledRules.push("GUIO_SENSE_ESPAI"); };
    if ($("input[name=guiopera]:checked").val() == "guiopera_enumeracions") {typo_enabledRules.push("GUIO_ESPAI"); };
    if ($("input[name=interrogant]:checked").val() == "interrogant_mai") {typo_enabledRules.push("EVITA_INTERROGACIO_INICIAL"); };
    if ($("input[name=interrogant]:checked").val() == "interrogant_sempre") {typo_enabledRules.push("CA_UNPAIRED_QUESTION"); };
    //if ($("input[name=exclamacio]:checked").val() == "exclamacio_mai") {typo_enabledRules = typo_enabledRules + ",EVITA_EXCLAMACIO_INICIAL"; };
    if ($("input[name=exclamacio]:checked").val() == "exclamacio_sempre") {
        typo_enabledRules.push("CA_UNPAIRED_EXCLAMATION"); 
        typo_disabledRules.push("EVITA_EXCLAMACIO_INICIAL"); };
    if ($("input[name=exclamacio]:checked").val() == "exclamacio_indefinit") {typo_disabledRules.push("EVITA_EXCLAMACIO_INICIAL"); };
    //if ($("input[name=percent]:checked").val() == "percent_senseespai") {typo_enabledRules = typo_enabledRules + ",PERCENT_SENSE_ESPAI"; };
    if ($("input[name=percent]:checked").val() == "percent_ambespai") {
        typo_enabledRules.push("PERCENT_AMB_ESPAI"); 
        typo_disabledRules.push("PERCENT_SENSE_ESPAI");};
    if ($("input[name=percent]:checked").val() == "percent_indefinit") {typo_disabledRules.push("PERCENT_SENSE_ESPAI"); };
    if ($("input[name=tres_punts]:checked").val()) { typo_enabledRules.push("PUNTS_SUSPENSIUS"); };
    if ($("input[name=prioritza_cometes]:checked").val()) { typo_enabledRules.push("PRIORITZAR_COMETES"); };
    if (!$("input[name=espais_blancs]:checked").val()) { typo_disabledRules.push("WHITESPACE_RULE"); };

    //Variant principal: general/valecià/balear
    if ($("input[name=variant]:checked").val() == "variant_general") {
    } else if ($("input[name=variant]:checked").val() == "variant_valencia") {
      ca_enabledRules.push("EXIGEIX_VERBS_VALENCIANS","EXIGEIX_POSSESSIUS_U");
      ca_disabledRules.push("EXIGEIX_VERBS_CENTRAL","EVITA_DEMOSTRATIUS_EIXE","EXIGEIX_POSSESSIUS_V");
      pushArray(ca_enabledRules, enabledRules);
      pushArray(ca_disabledRules, disabledRules);
      pushArray(ca_disabledCategories, disabledCategories);
    } else if ($("input[name=variant]:checked").val() == "variant_balear") {
      ca_enabledRules.push("EXIGEIX_VERBS_BALEARS");
      ca_disabledRules.push("EXIGEIX_VERBS_CENTRAL","CA_SIMPLE_REPLACE_BALEARIC");
    }

    pushArray(ca_enabledRules, typo_enabledRules);
    pushArray(ca_disabledRules, typo_disabledRules);
    pushArray(enabledRules, typo_enabledRules);
    pushArray(disabledRules, typo_disabledRules);

    var today = new Date();
    $('#output_text').html(
        "#LanguageTool Catalan configuration\n" +
        "#" + today + "\n" +
        "disabledRules.ca-ES=" + ca_disabledRules.join() + "\n" +
        "enabledRules.ca-ES=" + ca_enabledRules.join() + "\n" +
        "disabledCategories.ca-ES=" + ca_disabledCategories.join() + "\n" +
        "disabledRules.ca-ES-valencia=" + disabledRules.join() + "\n" +
        "enabledRules.ca-ES-valencia=" + enabledRules.join() + "\n" +
        "disabledCategories.ca-ES-valencia=" + disabledCategories.join() + "\n"
        );
 
    const MIME_TYPE = 'text/plain';
    var container = document.querySelector('#container');
    var output = container.querySelector('output');
    var output_text = document.querySelector('#output_text');
    var bb = new Blob([output_text.textContent], {type: MIME_TYPE});
    var a = document.createElement('a');
    a.download = "languagetool-ooo.cfg"; 
    a.href = window.URL.createObjectURL(bb);
    a.textContent = 'Baixa com a fitxer';
    a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
    a.draggable = true; // Don't really need, but good practice.
    a.classList.add('dragout');
    output.innerHTML = '';
    output.appendChild(a);

}

function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
}


// COOKIE

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function saveCookieStatus() {
    $.each(regles_amb_radio, function(index, nom) {
        var valor = $('[type="radio"][name="' + nom + '"]:checked').val();
        setCookie(nom, valor, 365);
    });

    $.each(regles_amb_checkbox, function(index, nom) {
        var valor = $('input[name=' + nom + ']:checked').val();
        if (valor) {
            setCookie(nom, 1, 365);
        } else {
            setCookie(nom, -1, 365);
        }
    });

}

function readCookieStatus() {
    $.each(regles_amb_radio, function(index, nom) {
        var valor = getCookie(nom);
        if (valor !== undefined) {
            $('[type="radio"][name="' + nom + '"][value="' + valor + '"]')
                .attr('checked', 'checked');
        }
    });

    $.each(regles_amb_checkbox, function(index, nom) {
        var valor = getCookie(nom);
        if (valor !== undefined) {
            if (valor > 0) {
                $('input[name=' + nom + ']').attr('checked', 'checked');
            } else {
                $('input[name=' + nom + ']').removeAttr('checked');
            }
        }
    });

    update_enabled_rules();
}

function update_enabled_rules() {
    if ($("input[name=opcio_general]:checked").val() != "criteris_cap") {
        document.getElementById("incoatius_eix").disabled = true;
        document.getElementById("incoatius_ix").disabled = true;
        document.getElementById("incoatius_esc").disabled = true;
        document.getElementById("incoatius_isc").disabled = true;
        document.getElementById("demostratius_aquest").disabled = true;
        document.getElementById("demostratius_este").disabled = true;
        document.getElementById("accentuacio_valenciana").disabled = true;
        document.getElementById("accentuacio_general").disabled = true;
        document.getElementById("concorda_dos_dues").disabled = true;
        document.getElementById("concorda_dos").disabled = true;
    } else {
        document.getElementById("incoatius_eix").disabled = false;
        document.getElementById("incoatius_ix").disabled = false;
        document.getElementById("incoatius_esc").disabled = false;
        document.getElementById("incoatius_isc").disabled = false;
        document.getElementById("demostratius_aquest").disabled = false;
        document.getElementById("demostratius_este").disabled = false;
        document.getElementById("accentuacio_valenciana").disabled = false;
        document.getElementById("accentuacio_general").disabled = false;
        document.getElementById("concorda_dos_dues").disabled = false;
        document.getElementById("concorda_dos").disabled = false;
    }
    if ($("input[name=opcio_general]:checked").val() == "criteris_uv") {
        document.getElementById("municipi_nom_valencia").disabled = true;
        document.getElementById("municipi_nom_oficial").disabled = true;
    } else {
        document.getElementById("municipi_nom_valencia").disabled = false;
        document.getElementById("municipi_nom_oficial").disabled = false;
    }
}
