/**
* elemeServices Module
*
* Description
*/
angular.module('elemeServices', ['ngResource']).factory('slideActivities', ['$resource', function($resource){
	return $resource('data/slides.json');
}]).factory('rstStream', ['$resource', function($resource){
	return {
		restaurants: $resource('data/restaurants.json')
	};
}]).factory('filtername', ['$resource', function($resource){
	return $resource('data/category.json');
}]).factory('templateParser', ["$parse", "$interpolate", function(e, t) {
	function r(o) {
		if (1 === o.nodeType) {
			var n, a, s, l, c = [],
				p = {
					tagName: o.tagName.toLowerCase()
				},
				d = o.attributes;
			for (s = 0, l = d.length; l > s; s++) {
				var u = d[s],
					f = u.name,
					g = u.nodeValue;
				if (f && "ng-" === f.substr(0, 3)) if (a || (a = {}), f.length > 8 && "ng-attr-" === f.substr(0, 8)) n || (n = {}), n[f.substr(9)] = e(g);
				else if ("ng-repeat" === f) {
					var h = /(\w+)\s+in(.*?)$/.exec(g);
					h && (a[f] = {
						itemName: h[1],
						getArray: e(h[2])
					})
				} else a[f] = i[f] ? t(g) : e(g);
				else n || (n = {}), /\s*({{\s*(.+?)\s*}})\s*/gi.test(g) ? n[f] = t(g) : n[f] = g
			}
			var m = o.childNodes;
			for (s = 0, l = m.length; l > s; s++) {
				var b = m[s];
				if (3 !== b.nodeType) c.push(r(b));
				else {
					var v = b.nodeValue;
					v && (/\s*({{\s*(.+?)\s*}})\s*/gi.test(v) ? c.push(t(v)) : (v = v.replace(/(\r\n|\n|\r|\s)/gm, ""), v.length && c.push(v)))
				}
			}
			return c.length > 0 && (p.children = c), n && (p.attrs = n), a && (p.dirs = a), p
		}
	}
	var i = {
		"ng-src": !0,
		"ng-href": !0
	};
	return {
		parse: function(e) {
			var t = document.createElement("div");
			return t.innerHTML = e, r(t).children
		}
	}
}]).factory('templateBuilder', function() {
	function e(e) {
		var t = {};
		for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
		return t
	}

	function t(e) {
		var t = function() {};
		return t.prototype = e, new t
	}

	function r(e) {
		var t = "";
		for (var r in e) e.hasOwnProperty(r) && (t += r + ":" + e[r] + ";");
		return t
	}

	function i(e) {
		var t = [];
		for (var r in e) e.hasOwnProperty(r) && e[r] && t.push(r);
		return t.join(" ")
	}

	function o(t) {
		var r = e(t);
		return r.dirs = e(t.dirs), r.dirs["ng-repeat"] = null, delete r.dirs["ng-repeat"], r
	}

	function n(e, c) {
		var p, d, u;
		if (e instanceof Array) {
			for (p = "", d = 0, u = e.length; u > d; d++) p += n(e[d], c);
			return p
		}
		if ("string" == typeof e) return e;
		if ("function" == typeof e) return e(c);
		var f = e.tagName,
			g = e.children,
			h = e.attrs,
			m = e.dirs,
			b = e.textContent,
			v = "",
			x = "";
		if (m && m["ng-repeat"]) {
			var y = o(e),
				k = m["ng-repeat"],
				w = k.getArray(c) || l,
				A = k.itemName;
			for (p = "", d = 0, u = w.length; u > d; d++) {
				var _ = t(c);
				_.$index = d, _.$first = 0 === d, _.$last = d === u - 1, _.$middle = !(_.$first || _.$last), _[A] = w[d], p += n(y, _)
			}
			return p
		}
		p = "<" + f;
		for (var C in m) if (m.hasOwnProperty(C)) {
			var S, I = m[C];
			if ("function" == typeof I && (S = I(c)), "ng-if" === C) {
				if (!S) return ""
			} else a[C] ? p += " " + C.substr(3) + '="' + S + '"' : s[C] ? b = S : "ng-style" === C ? x = r(S) + x : "ng-class" === C ? v += i(S) : ("ng-show" === C || "ng-hide" === C) && S && (v += " " + C)
		}
		for (var M in h) if (h.hasOwnProperty(M)) {
			var E = h[M];
			"function" == typeof E && (E = E(c)), "class" === M ? v += " " + E : p += " " + M + '="' + E + '"'
		}
		if (v && (p += ' class="' + v.trim() + '"'), x && (p += ' style="' + x + '"'), p += ">", b && (p += b), g) for (d = 0, u = g.length; u > d; d++) {
			var T = g[d];
			p += n(T, c)
		}
		return p += "</" + f + ">"
	}
	var a = {
		"ng-src": !0,
		"ng-href": !0,
		"ng-alt": !0,
		"ng-title": !0,
		"ng-id": !0,
		"ng-disabled": !0,
		"ng-value": !0
	},
		s = {
			"ng-html": !0,
			"ng-bind": !0,
			"ng-text": !0
		},
		l = [];
	return {
		build: n
	}
});