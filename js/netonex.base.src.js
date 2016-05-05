/*
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * netone.base.src.js
 */

var NetONEX = SXActiveX.extend({
	MAINX_PROGID: "NetONEX.MainX",
	MAINX_CLASSID: "EC336339-69E2-411A-8DE3-7FF7798F8307",
	MAINX_ID: "netonex", 
	NPAPI_MIME: "application/x-netone",
	NETONEX_ATTRS: {},
	SCRIPT_VERSION: "1.0.4",

	getMainXNpapi: function(obj) {
		var m = obj.NP_IMainX();
		return m;
	},

	getMainX: function() {
		var m = this.base();
		if (m) {
			m.DEBUG = this.asInt(this.NETONEX_ATTRS['DEBUG']);
			m.Quiet = this.asInt(this.NETONEX_ATTRS['Quiet']);
		}
		return m;
	},

	getBase64X: function() {
		return this.getInstanceX('Base64X');
	},

	getHashX: function() {
		return this.getInstanceX('HashX');		
	},

	getCertificateCollectionX: function() {
		return this.getInstanceX('CertificateCollectionX');		
	},
	
	getCSPEnrollX: function() {
		return this.getInstanceX('CSPEnrollX');
	},

	getSKFEnrollX: function() {
		return this.getInstanceX('SKFEnrollX');
	},
    
    getSKFTokenCollectionX: function() {
		return this.getInstanceX('SKFTokenCollectionX');        
    },
    
	getInstanceX: function(id) {
		var m = this.getMainX();
		var r = this.CONTROL_MAP[id];
		if ('undefined' != typeof r) {
			return this.CONTROL_MAP[id];
		}
		if (id == 'Base64X') {
			r = m.CreateBase64XInstance();
		}
		else if (id == 'HashX') {
			r = m.CreateHashXInstance();
		}
		else if (id == 'CertificateCollectionX') {
			r = m.CreateCertificateCollectionXInstance();
		}
		else if (id == 'CSPEnrollX') {
			r = m.CreateCSPEnrollXInstance();
		}
		else if (id == 'SKFEnrollX') {
			r = m.CreateSKFEnrollXInstance();
		}
		else if (id == 'SKFTokenCollectionX') {
			r = m.CreateSKFTokenCollectionXInstance();
		}
		if (!('Quiet' in r)) {
			throw new Error($.sprintf('%s is not running.', id));
		}
		this.CONTROL_MAP[id] = r;
		return r;
	},

	divSetup: function(div) {
		this.base(div);
		this.NETONEX_ATTRS['DEBUG'] = div.attr('debug') ? 1 : 0;
		this.NETONEX_ATTRS['Quiet'] = div.attr('quiet') ? 1 : 0;
	},

	setupObject: function() {
		var self = this;
		var r = false;
		$('div[action=netonex]').each(function() {
			self.divSetup($(this));
			r = true;
			return false;
		});
		return r;
	}
});
