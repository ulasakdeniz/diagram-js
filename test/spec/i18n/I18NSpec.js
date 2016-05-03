'use strict';

require('../../TestHelper');

/* global bootstrapDiagram, inject, sinon */


var paletteModule = require('../../../lib/features/palette'),
    i18nModule = require('../../../lib/i18n');

var spy = sinon.spy;


describe('i18n', function() {

  describe('config', function() {

    it('should specify at least one language', function() {
      // given
      bootstrapDiagram({
        modules: [ i18nModule ],
        i18n: {}
      })();

      // when
      var init = inject(function(i18n){});

      // then
      expect(init).to.throw('at least one language must be specified');
    });


    it('should provide translation for each language', function() {
      // given
      bootstrapDiagram({
        modules: [ i18nModule ],
        i18n: {
          activeLanguages: [ 'en', 'sp' ],
          en: { 'Translation key': 'Translation value' }
        }
      })();

      // when
      var init = inject(function(i18n){});

      // then
      expect(init).to.throw('translation must be provided for "sp"');
    });

  });


  describe('API', function() {

    beforeEach(bootstrapDiagram({
        modules: [ i18nModule ],
        i18n: {
          activeLanguages: [ 'sp', 'en' ],
          sp: { 'Translation key': 'Traducción valor' },
          en: { 'Translation key': 'Translation value' }
        }
      })
    );


    it('should return all registered languages', inject(function(i18n) {
      // when
      var languages = i18n.getRegisteredLanguages();

      // then
      expect(languages).to.eql([ 'sp', 'en' ]);
    }));


    it('should use first specified language as default', inject(function(i18n) {
      // given
      var key = 'Translation key';

      // when
      var value = i18n.translate(key);

      // then
      expect(value).to.eql('Traducción valor');
      expect(i18n.getActiveLanguage()).to.eql('sp');
    }));


    it('should change active language', inject(function(i18n) {
      // given
      var key = 'Translation key';

      // when
      i18n.activateLanguage('en');
      var value = i18n.translate(key);

      // then
      expect(value).to.eql('Translation value');
      expect(i18n.getActiveLanguage()).to.eql('en');
    }));


    describe('events', function() {

      it('should emit i18n.changed event on language change', inject(function(i18n, eventBus) {

        // given
        var listener = spy(function() {});

        eventBus.on('i18n.changed', listener);

        // when
        i18n.changed();

        // then
        expect(listener).to.have.been.called;
      }));

    });

  });


  describe('integration', function() {

    beforeEach(bootstrapDiagram({
      modules: [ i18nModule, paletteModule ],
      i18n: {
        activeLanguages: [ 'en' ],
        en: { 'Translation key': 'Translation value' }
      }
    }));


    it('should update palette', inject(function(palette, i18n) {

      // given
      var paletteUpdate = spy(palette, '_update');
      palette._init();

      // when
      i18n.changed();

      // then
      expect(paletteUpdate).to.have.been.called;
    }));

  });

});