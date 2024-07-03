import { Injectable } from '@angular/core';
import * as aesjs from 'aes-js';
import * as CryptoJS from 'crypto-js';

@Injectable({
	providedIn: 'root'
  })
export class CustomEncryption {
    
    /**
     * Logic to encrypt using AES/CBC/PKCS7 Encryption method
     * @data data to encrypt
     * @keyArray byte aaray key
     * @ivs intialisation vector byte array
     */
    public aesEncrypt(data: any, keyArray?: string | any[], ivs?: string | any[], type?: string) {
		let key: any = [];
		let iv: any = [];

        if (keyArray) {
			if (typeof(keyArray) === 'string') {
				const returnValue = aesjs.utils.utf8.toBytes(keyArray);
				key = returnValue;
			} else {
				key = keyArray
			}
        } else {
            key = [132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, 91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64]; // default
        }

        if (ivs) {
			if (typeof(ivs) === 'string') {
				const returnValue = aesjs.utils.utf8.toBytes(ivs);
				iv = returnValue;
			} else {
				iv = ivs;
			}
        } else {
            iv = [83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11]; // default
        }

		if (typeof data === 'object') {
			var text = JSON.stringify(data);
			var textBytes = aesjs.utils.utf8.toBytes(text);
		} else {
			var text2 = data;
			var textBytes = aesjs.utils.utf8.toBytes(text2);
			// console.log(textBytes);
		}

		if (type === 'ecb') {
			// var aesCbc = new aesjs.ModeOfOperation.ecb(key, null);
			var aesCbc = new aesjs.ModeOfOperation.ecb(key);

		} else {
			var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		}
		// var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		// var aesCbc = new aesjs.ModeOfOperation.ecb(key, null);
		var encryptedBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(textBytes));

		// To print or store the binary data, you may convert it to hex
		var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
		var hexArray = encryptedHex
			.replace(/\r|\n/g, "")
			.replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
			.replace(/ +$/, "")
			.split(" ")
			.map(Number);
		var byteString = String.fromCharCode.apply(null, hexArray);
		var base64string = window.btoa(byteString);
		
		// The cipher-block chaining mode of operation maintains internal
		// state, so to decrypt a new instance must be instantiated.
		// var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		// var decryptedBytes = aesCbc.decrypt(encryptedBytes);

		// // Convert our bytes back into text
		// var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		// console.log(decryptedText.toString());
		return base64string;
	}

	public getDecryptedValue(data: string, keyArray?: string | any[], ivs?: string | any[]) {
		let key: any = [];
		let iv: any = [];
		
		if (keyArray) {
			if (typeof(keyArray) === 'string') {
				const returnValue = aesjs.utils.utf8.toBytes(keyArray);
				key = returnValue;
			} else {
				key = keyArray
			}
        } else {
            key = [132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, 91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64]; // default
        }

        if (ivs) {
			if (typeof(ivs) === 'string') {
				const returnValue = aesjs.utils.utf8.toBytes(ivs);
				iv = returnValue;
			} else {
				iv = ivs;
			}
        } else {
            iv = [83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11]; // default
        }
		var binary_string = window.atob(data);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}

		var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		var decryptedBytes = aesCbc.decrypt(bytes);

		// // Convert our bytes back into text
		var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		// console.log(decryptedText.toString());
		return decryptedText.toString().trim();
	}

	public verifyOtpChecksum(res: any){
		const key = CryptoJS.enc.Utf8.parse('AaAz7PpYScdEci1K');
		const iv1 = CryptoJS.enc.Utf8.parse('AaAz7PpYScdEci1K');
		const encrypted = CryptoJS.AES.encrypt(res, key, {
			keySize: 16,
			iv: iv1,
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	}

	public encryptGuestLoginChecksum(str: any) {
		let randomKey = '';
		const characters = str;
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < 16) {
			randomKey += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		const key = CryptoJS.enc.Utf8.parse(randomKey);
		const iv1 = CryptoJS.enc.Utf8.parse(randomKey);
		const encrypted = CryptoJS.AES.encrypt(str, key, {
			keySize: 16,
			iv: iv1,
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return { checksumStr: encrypted.ciphertext.toString(CryptoJS.enc.Base64), checksumKey: randomKey };
	}

	public decryptGuestLoginChecksum(str: any, ckey: any) {
		const key = CryptoJS.enc.Utf8.parse(ckey);
		const iv1 = CryptoJS.enc.Utf8.parse(ckey);
		const decrypted = CryptoJS.AES.decrypt(str, key, {
			keySize: 16,
			iv: iv1,
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}

	public toUTF8Array(str: string) {
		var utf8 = [];
		for (var i=0; i < str.length; i++) {
			var charcode = str.charCodeAt(i);
			if (charcode < 0x80) utf8.push(charcode);
			else if (charcode < 0x800) {
				utf8.push(0xc0 | (charcode >> 6), 
						  0x80 | (charcode & 0x3f));
			}
			else if (charcode < 0xd800 || charcode >= 0xe000) {
				utf8.push(0xe0 | (charcode >> 12), 
						  0x80 | ((charcode>>6) & 0x3f), 
						  0x80 | (charcode & 0x3f));
			}
			// surrogate pair
			else {
				i++;
				// UTF-16 encodes 0x10000-0x10FFFF by
				// subtracting 0x10000 and splitting the
				// 20 bits of 0x0-0xFFFFF into two halves
				charcode = 0x10000 + (((charcode & 0x3ff)<<10)
						  | (str.charCodeAt(i) & 0x3ff));
				utf8.push(0xf0 | (charcode >>18), 
						  0x80 | ((charcode>>12) & 0x3f), 
						  0x80 | ((charcode>>6) & 0x3f), 
						  0x80 | (charcode & 0x3f));
			}
		}
		return utf8;
	}

	public encryptionforIPO(plain: string) : String {
        let Encode64 = "";
        const Map64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let t: number;
		let i: number;
		const textLength = Math.floor((plain.length) / 3) * 3 ;

        for (i = 0; i < textLength; i = i + 3) {		
			t = plain.charCodeAt(i) * 65536 + ( plain.charCodeAt(i + 1)) * 256 + plain.charCodeAt(i + 2);
			Encode64 = Encode64 + Map64.charAt((t / 262144)) + Map64.charAt((t & 258048) / 4096) + Map64.charAt((t & 4032) / 64) + Map64.charAt((t & 63));
        }
        switch (plain.length % 3) {
            case 1:
                t = plain.charCodeAt(i) * 65536;
                Encode64 = Encode64 + Map64.charAt((t / 262144)) + Map64.charAt((t & 258048) / 4096);
                break;
            case 2:
                t = plain.charCodeAt(i) * 65536 + (plain.charCodeAt(i + 1)) * 256;
                Encode64 = Encode64 + Map64.charAt((t / 262144)) + Map64.charAt((t & 258048) / 4096) + Map64.charAt((t & 4032) / 64);
                break;
        }
        return Encode64;
	}
}