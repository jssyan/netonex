/*
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * uniproxyx.base.src.js
 */

var SXActiveX = objectclass.extend({
	CONTROL_MAP: {},
	LOGSHOW_ID: "",
	MAINX_ID: "",
	MAINX_VERSION: "",
	MAINX_PROGID: "",  // must be overrided by child class
	MAINX_CLASSID: "", // must be overrided by child class
	ACTIVEX32_CODEBASE: "",
	ACTIVEX64_CODEBASE: "",
	NPAPI_MIME: "",    // can be overrided by child class
	MSI_CODEBASE: "",
	SCRIPT_VERSION: "1.0.0",
	DEBUG: 0,
	
	assert: function(v) {
		if (!v && this.DEBUG) {
			console.log("ASSERT!");
			alert('ASSERT!');
		}
	},

	isie: function() {
		var x = (window.ActiveXObject || ("ActiveXObject" in window));
		return x;
	},

	is64: function() {
		try {
			var x = navigator.cpuClass.toLowerCase();
			return (x === "x64");
		}
		catch (e) {
			return false;
		}
	},

	vardump: function(arr, level) {
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	},

	vb2js_array: function(v) {
		if (typeof VBArray !== 'undefined' && typeof v == 'unknown') {
			var j = (new VBArray(v)).toArray();
			return j;
		}
		return v;
	},

	js2vb_array: function(v) {
		if (typeof VBArray !== 'undefined') {
			// we can convert VBArray to javascript array in IE
			var dictionary = new ActiveXObject("Scripting.Dictionary");
			var i;
			var n = 0;
			for (i in v) {
				dictionary.add(n, v[i]);
				n ++;
			}
			return dictionary.Items();
		}
		return v;
	},
	
	asInt: function(v) {
		if (isNaN(v)) return 0;
		return parseInt(v);
	},

	asString: function(v) {
		if (!v) return '';
		return '' + v;
	},
	
	getLogElementID: function() {
		return this.LOGSHOW_ID;
	},

	getMainXElementID: function() {
		return this.MAINX_ID;
	},

	log: function(e) {
		var x = this.getLogElementID();
		if (!x) {
			return;
		}		
		var msg = '';
		if ('string' == typeof e) {
			msg = $.sprintf('<span class="green">%s</span>', e);
		}
		else {
			msg = this.DEBUG ? $.sprintf('<span class="red">[%s] %s</span>', e.stack, e.message) : $.sprintf('<span class="red">%s</span>', e.message);
		}
		var t = new Date();
		var d = $.sprintf('<br/>%d-%d-%d %d:%d:%d %s', t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), msg);
		$('#'+x).append(d);	
	},

	logClean:function() {
		var x = this.getLogElementID();
		$('#'+x).html('');
	},
	
	checkMainXActiveX: function(mainx) {
		if (!('Version' in mainx)) {
			throw new Error('ActiveX is not running.');
		}
		if (!this.isMainXUpToDate(mainx.Version)) {
			throw new Error('ActiveX is not up to date.');
		}
		return true;
	},

	getMainXNpapi: function(obj) {
		return false;
	},

	getMainX: function() {
		var m = this.CONTROL_MAP['MainX'];
		if ('undefined' != typeof m) {
			return m;
		}
		if (this.isie()) {
			try {
				this.assert(this.MAINX_PROGID);
				m = new ActiveXObject(this.MAINX_PROGID);
			}	
			catch(e) {
				//just continue;
			}
			if (m) {
				this.checkMainXActiveX(m);
				this.CONTROL_MAP['MainX'] = m;
				return m;
			}	
		}
		var id = this.getMainXElementID();
		if (!id) {
			throw new Error('Object element id is not set. Can not initialize object instance.');
		}
		m = document.getElementById(id);
		if (this.isie()) {
			this.checkMainXActiveX(m);
			this.CONTROL_MAP['MainX'] = m;
			return m;
		}
		else {
			if (this.NPAPI_MIME) {
				var x = this.getMainXNpapi(m);
				this.checkMainXActiveX(x);
				this.CONTROL_MAP['MainX'] = x;
				return x;
			}
		}
		throw new Error('ActiveX can only be running in Internet Explorer.');
	},
	
	getObjectElement: function() {
		if (!this.isie()) {
			if (this.NPAPI_MIME) {
				var r = document.createElement('object');
				this.assert(this.MAINX_ID);
				r.id = this.MAINX_ID;
				r.width = "1px";
				r.height = "1px";
				r.type = this.NPAPI_MIME;
				return r;
			}
			throw new Error('Unsupported browser, please try Internet Explorer.');
		}
		var codebase = this.is64() ? this.ACTIVEX64_CODEBASE : this.ACTIVEX32_CODEBASE;
		if (!codebase) {
			throw new Error('Can not initialize ActiveX object since codebase is not set.');
		}
		var r = document.createElement('object');
		this.assert(this.MAINX_ID);
		r.id = this.MAINX_ID;
		r.width = "1px";
		r.height = "1px";
		this.assert(this.MAINX_CLASSID);
		r.classid = "CLSID:" + this.MAINX_CLASSID;
		r.codeBase = $.sprintf('%s#Version=%s', codebase, this.MAINX_VERSION.replace(/\./g, ','));
		return r;
	},
	
	divSetup: function(div) {
		this.LOGSHOW_ID = div.attr('logshowid');
		this.MAINX_VERSION = div.attr('version');
		this.ACTIVEX32_CODEBASE = div.attr('activex32_codebase');
		this.ACTIVEX64_CODEBASE = div.attr('activex64_codebase');
		var a = div.attr('msi_codebase');
		if (!a) {
			// for compatible issue
			a = div.attr('npapi_codebase');
		}
		this.MSI_CODEBASE = a;
		this.assert(this.MAINX_ID);

		var s = this.getObjectElement();
		if (s) {
			div.append(s);
		}

		try {
			this.getMainX();
		}
		catch (e) {
			this.log(e);
			throw new Error($.sprintf('Please download and install <a href="%s">this installer</a>, restart the browser after the installation is finished.', this.MSI_CODEBASE));
		}
	},

	isMainXUpToDate: function(mainv) {
		if (!this.MAINX_VERSION) return true;
		var d = this.MAINX_VERSION.split('.');
		var i, v = 0;	
		for (i in d) {
			var q = this.asInt(d[i]);
			v = v * 0x100 + q;
		}
		var a = this.asInt(mainv);
		return (a >= v) ? 1 : 0;
	},

	isNpapiInstalled: function() {
		if (!this.NPAPI_MIME) {
			return 0;
		}
		var x = navigator.mimeTypes[this.NPAPI_MIME];
		return (x === undefined) ? 0 : 1;
	}

});

