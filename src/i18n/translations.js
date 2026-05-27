// Détection automatique de la langue système
import { NativeModules, Platform } from 'react-native';

const getDeviceLanguage = () => {
  const locale = Platform.OS === 'android'
    ? NativeModules.I18nManager?.localeIdentifier
    : NativeModules.SettingsManager?.settings?.AppleLocale
      || NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
  return (locale || 'en').substring(0, 2).toLowerCase();
};

const lang = getDeviceLanguage();

const translations = {
  fr: {
    // Navigation
    nav_collection:   'Collection',
    nav_stats:        'Stats',
    nav_add:          'Ajouter',
    nav_market:       'Marché',
    nav_settings:     'Réglages',

    // Hero banner
    hero_welcome:     'Bienvenue dans',
    hero_subtitle:    'Gérez, suivez et protégez\nvotre collection.',

    // Action grid
    action_collection: 'Ma collection',
    action_stats:      'Statistiques',
    action_add:        'Ajouter',
    action_market:     'Marché',
    action_cards:      'cartes',
    action_total:      'Valeur totale',
    action_new:        'Nouvelle carte',
    action_browse:     'Parcourir',

    // Overview
    overview_title:    'Aperçu de la collection',
    overview_see_all:  'Voir tout',
    overview_cards:    'Cartes',
    overview_cats:     'Catégories',
    overview_value:    'Valeur totale',

    // Recent activity
    recent_title:      'Activité récente',
    recent_see_all:    'Voir tout',
    recent_today:      "Aujourd'hui",
    recent_yesterday:  'Hier',

    // Empty state
    empty_title:       'Ta collection est vide',
    empty_sub:         'Ajoute ta première carte pour commencer à suivre ta collection.',
    empty_cta:         '➕ Ajouter ma première carte',

    // Add card
    add_title:         '+ Ajouter une carte',
    add_back:          '← Retour',
    add_photo:         'Photo de la carte',
    add_camera:        '📷 Caméra',
    add_gallery:       '🖼 Galerie',
    add_search_photo:  '🔍 Chercher la photo sur eBay',
    add_search_hint:   'Basé sur joueur + set + # carte',
    add_sport:         'Sport',
    add_player:        'Joueur *',
    add_team:          'Équipe',
    add_year:          'Année',
    add_set:           'Set / Collection',
    add_number:        '# Carte',
    add_condition:     'Condition',
    add_currency:      'Devise',
    add_value:         'Valeur',
    add_qty:           'Qté',
    add_notes:         'Notes',
    add_save:          '✅ Sauvegarder la carte',
    add_required:      'Champs manquants',
    add_required_msg:  'Le joueur et la valeur sont requis.',

    // Settings
    settings_title:    'Réglages',
    settings_theme:    'Thème',
    settings_theme_auto: 'Automatique (système)',
    settings_theme_dark: 'Sombre',
    settings_theme_light:'Clair',
    settings_language: 'Langue',
    settings_currency: 'Devise principale',
    settings_about:    'À propos',
    settings_version:  'Version',

    // Stats
    stats_title:       'Statistiques',
    stats_collection:  '📊 Collection',
    stats_sales:       '💰 Ventes',
    stats_total_value: 'VALEUR TOTALE DE LA COLLECTION',
    stats_summary:     'Résumé',
    stats_count:       'Nombre de cartes',
    stats_unique:      'Entrées uniques',
    stats_avg:         'Valeur moyenne',
    stats_top:         '🏆 Top 5 cartes les plus valuables',
    stats_by_sport:    'Par sport',
    stats_no_cards:    'Aucune carte dans ta collection',
    stats_total_sales: 'TOTAL DES VENTES',
    stats_today:       "Aujourd'hui",
    stats_month:       'Ce mois',
    stats_year:        'Cette année',
    stats_history:     'Historique',
    stats_no_sales:    'Aucune vente enregistrée',
    stats_sell_hint:   'Appuie sur 🏷️ sur une carte pour enregistrer une vente',

    // Market
    market_title:      'Marché',
    market_ebay:       'eBay — Ventes récentes',
    market_active:     'eBay — Annonces actives',
    market_130:        '130point.com',
    market_sell:       '🏷️ Vendre sur eBay',

    // Conditions
    cond_ungraded:     'Non gradé',
    cond_psa:          'PSA',
    cond_bgs:          'BGS / Beckett',
    cond_sgc:          'SGC',
    cond_cgc:          'CGC',

    // General
    cancel:            'Annuler',
    confirm:           '✅ Confirmer',
    delete:            'Supprimer',
    edit:              'Modifier',
    save:              'Sauvegarder',
    sell:              'Vendre',
    back:              'Retour',
    search:            'Joueur, équipe, set…',
    all:               'Tous',
    other:             'Autre',
    error:             'Erreur',
    ok:                'OK',
  },

  en: {
    nav_collection:   'Collection',
    nav_stats:        'Stats',
    nav_add:          'Add',
    nav_market:       'Market',
    nav_settings:     'Settings',

    hero_welcome:     'Welcome to',
    hero_subtitle:    'Manage, track and protect\nyour collection.',

    action_collection: 'My collection',
    action_stats:      'Statistics',
    action_add:        'Add',
    action_market:     'Market',
    action_cards:      'cards',
    action_total:      'Total value',
    action_new:        'New card',
    action_browse:     'Browse',

    overview_title:    'Collection overview',
    overview_see_all:  'See all',
    overview_cards:    'Cards',
    overview_cats:     'Categories',
    overview_value:    'Total value',

    recent_title:      'Recent activity',
    recent_see_all:    'See all',
    recent_today:      'Today',
    recent_yesterday:  'Yesterday',

    empty_title:       'Your collection is empty',
    empty_sub:         'Add your first card to start tracking your collection.',
    empty_cta:         '➕ Add my first card',

    add_title:         '+ Add a card',
    add_back:          '← Back',
    add_photo:         'Card photo',
    add_camera:        '📷 Camera',
    add_gallery:       '🖼 Gallery',
    add_search_photo:  '🔍 Search photo on eBay',
    add_search_hint:   'Based on player + set + card #',
    add_sport:         'Sport',
    add_player:        'Player *',
    add_team:          'Team',
    add_year:          'Year',
    add_set:           'Set / Collection',
    add_number:        'Card #',
    add_condition:     'Condition',
    add_currency:      'Currency',
    add_value:         'Value',
    add_qty:           'Qty',
    add_notes:         'Notes',
    add_save:          '✅ Save card',
    add_required:      'Missing fields',
    add_required_msg:  'Player and value are required.',

    settings_title:    'Settings',
    settings_theme:    'Theme',
    settings_theme_auto: 'Automatic (system)',
    settings_theme_dark: 'Dark',
    settings_theme_light:'Light',
    settings_language: 'Language',
    settings_currency: 'Main currency',
    settings_about:    'About',
    settings_version:  'Version',

    stats_title:       'Statistics',
    stats_collection:  '📊 Collection',
    stats_sales:       '💰 Sales',
    stats_total_value: 'TOTAL COLLECTION VALUE',
    stats_summary:     'Summary',
    stats_count:       'Number of cards',
    stats_unique:      'Unique entries',
    stats_avg:         'Average value',
    stats_top:         '🏆 Top 5 most valuable cards',
    stats_by_sport:    'By sport',
    stats_no_cards:    'No cards in your collection',
    stats_total_sales: 'TOTAL SALES',
    stats_today:       'Today',
    stats_month:       'This month',
    stats_year:        'This year',
    stats_history:     'History',
    stats_no_sales:    'No sales recorded',
    stats_sell_hint:   'Tap 🏷️ on a card to record a sale',

    market_title:      'Market',
    market_ebay:       'eBay — Recent sales',
    market_active:     'eBay — Active listings',
    market_130:        '130point.com',
    market_sell:       '🏷️ Sell on eBay',

    cond_ungraded:     'Ungraded',
    cond_psa:          'PSA',
    cond_bgs:          'BGS / Beckett',
    cond_sgc:          'SGC',
    cond_cgc:          'CGC',

    cancel:            'Cancel',
    confirm:           '✅ Confirm',
    delete:            'Delete',
    edit:              'Edit',
    save:              'Save',
    sell:              'Sell',
    back:              'Back',
    search:            'Player, team, set…',
    all:               'All',
    other:             'Other',
    error:             'Error',
    ok:                'OK',
    // Comparables
    comp_sold:         '💰 eBay Sold',
    comp_sold_sub:     'Completed sales',
    comp_active:       '🛒 eBay Active',
    comp_active_sub:   'Active listings',
    comp_130:          '🎯 130point',
    comp_loading_ebay: 'Loading eBay…',
    comp_loading_130:  'Loading 130point…',

    // Market
    market_sold_sub:   'Sports cards · Last 90 days',
    market_nhl:        '🏒 eBay Hockey Cards',
    market_nhl_sub:    'NHL · Active listings',
    market_nfl:        '🏈 eBay Football Cards',
    market_nfl_sub:    'NFL · Active listings',

    // Settings
    settings_theme_current: 'Current theme',
    settings_system_hint:   'based on your phone',
    settings_currency_sub:  'Value shown in CAD$',
    settings_sports:        'Supported sports',
    settings_sports_sub:    'NHL Hockey · NFL Football',
    settings_ebay:          'eBay Data',
    settings_ebay_sub:      'Browse API · Production',
    settings_storage:       'Storage',
    settings_storage_sub:   'Local · AsyncStorage',
    settings_light:         '☀️ Light',
    settings_dark:          '🌙 Dark',
    settings_system:        '📱 System',
  },
};

// Fallback sur l'anglais si langue inconnue
const t = translations[lang] || translations.en;

export default t;
export { lang };
