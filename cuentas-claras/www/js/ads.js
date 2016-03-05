(function () {
  'use strict';

  var admobData = {};

  // Determine platform
  if (/(android)/i.test(navigator.userAgent)) {
    admobData = {
      //banner: "ca-app-pub-7515525101165816/8899419086"

      banner: "ca-app-pub-3940256099942544/6300978111"
    };
  } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobData = {
      banner: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    };
  } else {
    admobData = {
      banner: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    };
  }

  function setBanner() {
    if (AdMob) {
      AdMob.createBanner({
        adId: admobData.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true
      });
    }
  }

  document.addEventListener('deviceready', setBanner, false);
}());
