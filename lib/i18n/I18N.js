'use strict';

var interpolate = require('./translate/translate');

/**
 * A component that handles language switching in a unified way.
 *
 * @param {EventBus} eventBus
 */
function I18N(config, eventBus) {
  // dependencies
  this._eventBus = eventBus;
  this._config = config || {};

  // state
  this._translations = {};
  this._currentTranslation = {};
  this._currentLanguage;

  // init
  var self = this;
  var languages = this._config.activeLanguages;

  if (!languages || languages.length < 1) {
    throw new Error('at least one language must be specified');
  }

  languages.forEach(function(lang) {
    var translation = self._config[lang];

    if (!translation) {
      throw new Error('translation must be provided for "' + lang + '"');
    }

    self._registerLanguage(lang, translation);
  });

  // activating first language supplied
  this._setTranslation(this._config.activeLanguages[0]);
}


I18N.$inject = [ 'config.i18n', 'eventBus' ];

module.exports = I18N;


/**
 * Inform components that the language changed.
 *
 * Emit a `i18n.changed` event for others to hook into, too.
 */
I18N.prototype.changed = function() {
  // TODO: convert to internal API
  this._eventBus.fire('i18n.changed');
};


/**
 * Get currently active language.
 *
 * @return {String}
 */
I18N.prototype.getActiveLanguage = function() {
  return this._currentLanguage;
};


/**
 * Get all registered languages.
 *
 * @return {Array<String>}
 */
I18N.prototype.getRegisteredLanguages = function() {
  return Object.keys(this._translations);
};


I18N.prototype.translate = function(key, replacements) {
  var template = this._currentTranslation[key];

  return interpolate(template, replacements);
};


/**
 * Activates given language.
 * Throws an error if language is not reigstered.
 *
 * @param  {String} language
 */
I18N.prototype.activateLanguage = function(language) {
  this._setTranslation(language);

  this.changed();
};


/**
 * Register translation for the given language.
 *
 * @param  {String} language
 * @param  {Object} translation
 */
I18N.prototype._registerLanguage = function(language, translation) {
  this._translations[language] = translation;
};


/**
 * Internal language switch.
 * Assumes that supplied language is already registered.
 *
 * @param  {String} language
 */
I18N.prototype._setTranslation = function(language) {
  this._currentTranslation = this._translations[language];
  this._currentLanguage = language;
};