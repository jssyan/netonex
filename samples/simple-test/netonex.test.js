/*
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * netone.test.js
 */

var NetONEXTest = NetONEX.extend({

	testBase64X: function() {
		var activex = this.getBase64X();
		var s = "中文";
		//var s = "ABCD";
		var h = "ABCD";
		var b = this.js2vb_array([1, 2, 3]);
		var r, d;

		r = activex.EncodeString(s);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("EncodeString: %s -> %s", s, r));
		d = activex.DecodeString(r);
		//alert(d);
		if (d != s) {
			throw new Error(activex.ErrorString);			
		}
		this.log($.sprintf("DecodeString: %s -> %s", r, d));

		r = activex.EncodeUtf8String(s);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("EncodeUtf8String: %s -> %s", s, r));
		d = activex.DecodeUtf8String(r);
		//alert(d);
		if (d != s) {
			throw new Error(activex.ErrorString);			
		}
		this.log($.sprintf("DecodeUtf8String: %s -> %s", r, d));

		r = activex.EncodeHexString(h);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("EncodeHexString: %s -> %s", h, r));
		d = activex.DecodeHexString(r);
		if (d != h) {
			throw new Error(activex.ErrorString);			
		}
		this.log($.sprintf("DecodeHexString: %s -> %s", r, d));

		r = activex.EncodeBytes(b);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("EncodeBytes: %s", r));

		d = activex.DecodeBytes(r);
		d = this.vb2js_array(d);
		if (!d) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("DecodeBytes: %s", this.vardump(d)));
	},

	testHashX: function() {
		var activex = this.getHashX();
		var s = "ABCD中文";
		var b = this.js2vb_array([1, 2, 3]);
		var f = 'C:\\ZYY\\a.txt';
		var r;

		r = activex.SHA1String(s);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("SHA1String: %s", r));
		r = activex.SHA1String(b);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("SHA1String: %s", r));

		r = activex.SHA1File(f);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("SHA1File: %s", r));

		r = activex.SHA1Bytes(b);
		r = this.vb2js_array(r);
		if (!r) {
			throw new Error(activex.ErrorString);
		}
		this.log($.sprintf("SHA1Bytes: %s", this.vardump(r, 0)));
	},

	printProperties: function(obj, props) {
		for (var i in props) {
			var x;
			eval("x = obj." + props[i] + ";");
			d = $.sprintf("%s: [%s]", props[i], x);
			this.log(d);
		}
	},

	printCertificateCollectionX: function(colx) {
		this.log($.sprintf('CryptoInterface: %d Size: %d', colx.CryptoInterface, colx.Size));
		var n;
		for (n = 0; n < colx.Size; n ++) {
			var crt = colx.GetAt(n);
			if (!crt) {
				throw new Error($.sprintf('GetAt() failed at %d.', n));
			}
			this.printCertificateX(crt);
		}
		var props = [
  "ErrorString",
  "CF_KeyUsage",
  "CF_Subject_Contains",
  "CF_Issuer_Contains",
  "CF_Issuer_Regex",
  "CF_Subject_Regex",
  "LastError",
  "OEM",
  "Quiet",
  "DEBUG",
  "Size",
  "CryptoInterface",
  "Copyright"];
		this.printProperties(colx, props);
	},

	printCertificateX: function(crtx, detail) {
		//alert(this.vardump(crtx));
		//alert(crtx.Issuer);
		var d = $.sprintf("%s Issuer: [%s]", crtx.ToString(), crtx.Issuer);
		this.log(d);
		if (detail) {
			var props = ['DEBUG', 'Algorithm', 'ContainerName', 'Content', 'CryptoInterfaceName', 'DefaultCipher', 'DefaultP1Digest', 'DefaultP7Digest', 
			             'FriendlyName', 'IsPrivateKeyAccessible', 'Issuer', 'IssuerUniqueIdHexString', 'IssuerUniqueIdPrintable',
			             'NotAfterSystemTime', 'NotAfterTimestamp', 'NotBeforeSystemTime', 'NotBeforeTimestamp', 'Keybits',
			             'KeyUsage', 'ProviderName', 'Copyright', 'SerialNumber', 'SerialNumberHex', 'SerialNumberDec', 'SignatureAlgorithm',
			             'Subject', 'SubjectUniqueIdHexString', 'SubjectUniqueIdPrintable', 'ThumbprintMD5', 'ThumbprintSHA1', 'Version'];
			this.printProperties(crtx, props);
		}
	},

	printSKFTokenX: function(colx) {
		var props = [
  "Name",
  "CryptoInterface",
  "SerialNumber",
  "HWVersion",
  "Manufacturer",
  "FirmwareVersion",
  "ProviderModuleName"];
		this.printProperties(colx, props);
	},

	testCertificateCollectionX: function() {
		var activex = this.getCertificateCollectionX();
		var cis = [1, 2, 3];
		for (var i in cis) {
			activex.CryptoInterface = cis[i];
			activex.Load();
			this.printCertificateCollectionX(activex);
		}

		activex.CF_Subject_Contains = 'cx';
		activex.Load();
		this.printCertificateCollectionX(activex);
		activex.CF_Issuer_Contains = "CA-B";
		activex.Load();
		this.printCertificateCollectionX(activex);
		activex.CF_Issuer_Contains = '';
		activex.CF_Subject_Contains = '';
		activex.CF_Issuer_Regex = "(我是一个CA|Gateway)"
		activex.Load();
		this.printCertificateCollectionX(activex);

		/*
		var crtx = activex.CreateCertificateFile('');
		if (!crtx) {
			throw new Error(activex.ErrorString);
		}
		this.printCertificateX(crtx, 1);
		*/
	},

	testCertificateX: function() {
		var b64x = this.getBase64X();
		var hshx = this.getHashX();
		var colx = this.getCertificateCollectionX();
		colx.CryptoInterface = 3;
		colx.CF_Issuer_Contains = '';
		colx.CF_Subject_Contains = '';
		colx.Load();
		//var t = colx.Size;

		var crtx = colx.SelectCertificateDialog();
		if (!crtx) {
			throw new Error(colx.ErrorString);
		}
		this.printCertificateX(crtx, 1);

		var s = "ABCD中文";
		var b = this.js2vb_array([1, 2, 3]);
		var f = 'C:\\ZYY\\a.txt';
		var e, d;

		e = crtx.PKCS1Bytes(b);
		e = this.vb2js_array(e);
		if (!e || !e.length) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PKCS1Bytes: %s", this.vardump(e, 0)));

		e = crtx.PKCS1String(s);
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PKCS1String: %s", e));
		if (crtx.PKCS1Verify(e, b64x.EncodeString(s))) {
			throw new Error(crtx.ErrorString);			
		}
		this.log("PKCS1Verify ok");

		e = crtx.PKCS1Base64(b64x.EncodeUtf8String(s));
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PKCS1Base64: %s", e));
		if (crtx.PKCS1Verify(e, b64x.EncodeUtf8String(s))) {
			throw new Error(crtx.ErrorString);			
		}
		this.log("PKCS1Verify ok");
		
		e = crtx.PKCS1File(f);
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PKCS1File: %s", e));
		if (crtx.PKCS1VerifyFile(e, f)) {
			throw new Error(crtx.ErrorString);			
		}
		this.log("PKCS1VerifyFile ok");
        
        if (crtx.Algorithm == 'SM2') {
            //crtx.DEBUG = 1;
            d = "00112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF";
            if (!d) {
                throw new Error(crtx.ErrorString);			
            }
            e = crtx.PKCS1Digest(b64x.EncodeHexString(d), "ecdsa-sm2-with-sm3");
            if (!e) {
                throw new Error(crtx.ErrorString);
            }
            this.log($.sprintf("PKCS1Digest: %s", e));
            if (crtx.PKCS1VerifyDigest(e, b64x.EncodeHexString(d))) {
                throw new Error(crtx.ErrorString);			
            }
            this.log("PKCS1VerifyDigest ok");
        }
        else {
            d = hshx.SHA1String(s);
            if (!d) {
                throw new Error(crtx.ErrorString);			
            }
            e = crtx.PKCS1Digest(b64x.EncodeHexString(d), "sha1");
            if (!e) {
                throw new Error(crtx.ErrorString);
            }
            this.log($.sprintf("PKCS1Digest: %s", e));
            if (crtx.PKCS1VerifyDigest(e, b64x.EncodeHexString(d))) {
                throw new Error(crtx.ErrorString);			
            }
            this.log("PKCS1VerifyDigest ok");
        }
        
		for (n = 0; n < 2; n ++) {
			e = crtx.PKCS7String(s, n);
			if (!e) {
				throw new Error(crtx.ErrorString);
			}
			this.log($.sprintf("PKCS7String (%d [%s]): %s", n, s, e));
		}

		for (n = 0; n < 2; n ++) {
			e = crtx.PKCS7Bytes(b, n);
			e = this.vb2js_array(e);
			if (!e || !e.length) {
				throw new Error(crtx.ErrorString);
			}
			this.log($.sprintf("PKCS7Bytes (%d): %s", n, this.vardump(e, 0)));
		}

		e = crtx.PublicEncrypt(b64x.EncodeString(s));
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PublicEncrypt: %s", e));

		d = crtx.PrivateDecrypt(e);
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("PrivateDecrypt: %s", d));

		e = crtx.EnvSeal(b64x.EncodeString(s));
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("EnvSeal: %s", e));

		d = crtx.EnvOpen(e);
		if (!e) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("EnvOpen: %s", d));

		if (crtx.EnvSealFile(f, f + '.sealed')) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("EnvSealFile: %s", f + '.sealed'));

		if (crtx.EnvOpenFile(f + '.sealed', f + ".opened")) {
			throw new Error(crtx.ErrorString);
		}
		this.log($.sprintf("EnvOpenFile: %s", f + ".opened"));

		var oid = ['1.2.3', '2.5.29.19'];
		for (var i in oid) {
			d = crtx.GetExtensionString(oid[i], 0);
			this.log($.sprintf("GetExtensionString: %s (%s)", d, oid[i]));
			d = crtx.GetExtensionString(oid[i], 1);
			this.log($.sprintf("GetExtensionString: %s (%s)", d, oid[i]));
		}
        

        var xml = '<root><a>abc</a></root>';
        d = crtx.XMLSignEnveloping(xml);
        this.log($.sprintf("XMLSignEnveloping: <pre>(%s)</pre>", $('<div/>').text(d).html()));
        d = crtx.XMLSign(xml);
        this.log($.sprintf("XMLSign: <pre>(%s)</pre>", $('<div/>').text(d).html()));
	},
    
    testSKFTokenCollectionX: function() {
		var activex = this.getSKFTokenCollectionX();
        var n = activex.Load();
        this.log($.sprintf("SKFTokenCollectionX: loaded %d. size=%d", n, activex.Size));
        for (n = 0; n < activex.Size; n ++) {
            var x = activex.GetAt(n);
            //this.log($.sprintf("SKFToken: name=[%s]", x.Name));
            this.printSKFTokenX(x);
        }
        var x = activex.SelectTokenDialog();
        if (x) {
            this.printSKFTokenX(x);
        }
    },

	testUserPIN: function() {
		var colx = this.getCertificateCollectionX();
		colx.CF_Issuer_Contains = '';
		colx.CF_Subject_Contains = '';
		colx.Load();
		//var t = colx.Size;

		var crtx = colx.SelectCertificateDialog();
		if (!crtx) {
			throw new Error(colx.ErrorString);
		}
		var r = crtx.VerifyPIN("111111");
		this.log($.sprintf("verify ret=%d", r));
		r = crtx.VerifyPIN("111112");
		this.log($.sprintf("verify ret=%d", r));
		r = crtx.VerifyPIN("111111");
		this.log($.sprintf("verify ret=%d", r));
		crtx.UserPIN = "111111";
		r = crtx.VerifyPIN("");
		this.log($.sprintf("verify ret=%d userpin=%s", r, crtx.UserPIN));
	},
    
	testPinCache: function() {
		var colx = this.getCertificateCollectionX();
		colx.Load();
		var crtx = colx.SelectCertificateDialog();
		if (!crtx) {
			throw new Error(colx.ErrorString);
		}
		var s = "abcd";
		var n;
		var b64x = this.getBase64X();
		for (n = 0; n < 3; n ++) {
			this.log('test ' + n);
			var x = crtx.PKCS1String(s);
			this.log('test ' + n + ' pkcs1: ' + x);
			x = crtx.PKCS7String(s, 0);
			this.log('test ' + n + ' pkcs7: ' + x);
			x = crtx.EnvSeal(b64x.EncodeString(s));
			this.log($.sprintf("EnvSeal: %s", x));
			x = crtx.EnvOpen(x);
			this.log($.sprintf("EnvOpen: %s", x));
		}
	},

	testPKCS7SigX: function() {
		var colx = this.getCertificateCollectionX();
		colx.Load();
		var crtx = colx.SelectCertificateDialog();
		if (!crtx) {
			throw new Error(colx.ErrorString);
		}
		var s = "ABCD中文";
		var n, i;
		for (n = 0; n < 2; n ++) {
			var e = crtx.PKCS7String(s, n);
			if (!e) {
				throw new Error(crtx.ErrorString);
			}
			this.log($.sprintf("PKCS7String (%d [%s]): %s", n, s, e));

			var mx = this.getMainX();
			var px = mx.CreatePKCS7SigXInstance();
			px.DEBUG = 1;
			if (px.Load(e)) {
				this.log($.sprintf("detached = %s, content = (%s)", px.IsDetached ? "yes" : "no", px.ContentAsString));
				if (px.IsDetached) {  // Set content before verify if px is detached
					px.ContentAsString = s;
					// check for base64 set/get
					// px.ContentAsBase64 = px.ContentAsBase64; 
				}
				this.log($.sprintf("%d (%s) (%s) （%s)", px.Verify(), px.ContentAsString, px.ContentAsBase64, px.ToBASE64()));
				this.log($.sprintf("signers (%d)", px.SignerCount));
				for (i = 0; i < px.SignerCount; i ++) {
					this.log("==========================");
					var cx = px.GetSignerAt(i);
					this.printCertificateX(cx);
				}
			}
			this.log("+++++++++++++++++++++++++");
		}
	},

	run: function() {
		//alert('start');
		try {
			var m = this.getMainX();
			this.log($.sprintf("VERSION: %08x", m.Version));
			//this.testBase64X();
			//this.testHashX();
			//this.testCertificateCollectionX();
			//this.testCertificateX();
			//this.testSKFTokenCollectionX();
			//this.testUserPIN();
			//this.testPinCache();
			this.testPKCS7SigX();
		}
		catch (e) {
			this.log(e);
		}
	}
});

$(document).ready(function() {
	var obj = new NetONEXTest();
	obj.setupObject();
	obj.run();
});
