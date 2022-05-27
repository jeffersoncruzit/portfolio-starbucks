/*
 CoreTemplate 2016-02-24 
*/
var Base = function() {};

Base.extend = function(a, b) {
    "use strict";
    var c = Base.prototype.extend;
    Base._prototyping = !0;
    var d = new this();
    c.call(d, a), d.base = function() {}, delete Base._prototyping;
    var e = d.constructor, f = d.constructor = function() {
        if (!Base._prototyping) if (this._constructing || this.constructor == f) this._constructing = !0, 
        e.apply(this, arguments), delete this._constructing; else if (null !== arguments[0]) return (arguments[0].extend || c).call(arguments[0], d);
    };
    return f.ancestor = this, f.extend = this.extend, f.forEach = this.forEach, f.implement = this.implement, 
    f.prototype = d, f.toString = this.toString, f.valueOf = function(a) {
        return "object" == a ? f : e.valueOf();
    }, c.call(f, b), "function" == typeof f.init && f.init(), f;
}, Base.prototype = {
    extend: function(a, b) {
        if (arguments.length > 1) {
            var c = this[a];
            if (c && "function" == typeof b && (!c.valueOf || c.valueOf() != b.valueOf()) && /\bbase\b/.test(b)) {
                var d = b.valueOf();
                b = function() {
                    var a = this.base || Base.prototype.base;
                    this.base = c;
                    var b = d.apply(this, arguments);
                    return this.base = a, b;
                }, b.valueOf = function(a) {
                    return "object" == a ? b : d;
                }, b.toString = Base.toString;
            }
            this[a] = b;
        } else if (a) {
            var e = Base.prototype.extend;
            Base._prototyping || "function" == typeof this || (e = this.extend || e);
            for (var f = {
                toSource: null
            }, g = [ "constructor", "toString", "valueOf" ], h = Base._prototyping ? 0 : 1; i = g[h++]; ) a[i] != f[i] && e.call(this, i, a[i]);
            for (var i in a) f[i] || e.call(this, i, a[i]);
        }
        return this;
    }
}, Base = Base.extend({
    constructor: function() {
        this.extend(arguments[0]);
    }
}, {
    ancestor: Object,
    version: "1.1",
    forEach: function(a, b, c) {
        for (var d in a) void 0 === this.prototype[d] && b.call(c, a[d], d, a);
    },
    implement: function() {
        for (var a = 0; a < arguments.length; a++) "function" == typeof arguments[a] ? arguments[a](this.prototype) : this.prototype.extend(arguments[a]);
        return this;
    },
    toString: function() {
        return String(this.valueOf());
    }
});

var FlipClock;

!function(a) {
    "use strict";
    FlipClock = function(a, b, c) {
        return new FlipClock.Factory(a, b, c);
    }, FlipClock.Lang = {}, FlipClock.Base = Base.extend({
        buildDate: "2013-11-07",
        version: "0.3.1",
        constructor: function(b, c) {
            "object" != typeof b && (b = {}), "object" != typeof c && (c = {}), this.setOptions(a.extend(!0, {}, b, c));
        },
        callback: function(a) {
            if ("function" == typeof a) {
                for (var b = [], c = 1; c <= arguments.length; c++) arguments[c] && b.push(arguments[c]);
                a.apply(this, b);
            }
        },
        log: function(a) {
            window.console && console.log && console.log(a);
        },
        getOption: function(a) {
            return this[a] ? this[a] : !1;
        },
        getOptions: function() {
            return this;
        },
        setOption: function(a, b) {
            this[a] = b;
        },
        setOptions: function(a) {
            for (var b in a) "undefined" != typeof a[b] && this.setOption(b, a[b]);
        }
    }), FlipClock.Factory = FlipClock.Base.extend({
        autoStart: !0,
        callbacks: {
            destroy: !1,
            create: !1,
            init: !1,
            interval: !1,
            start: !1,
            stop: !1,
            reset: !1
        },
        classes: {
            active: "flip-clock-active",
            before: "flip-clock-before",
            divider: "flip-clock-divider",
            dot: "flip-clock-dot",
            label: "flip-clock-label",
            flip: "flip",
            play: "play",
            wrapper: "flip-clock-wrapper"
        },
        clockFace: "HourlyCounter",
        defaultClockFace: "HourlyCounter",
        defaultLanguage: "english",
        language: "english",
        lang: !1,
        face: !0,
        running: !1,
        time: !1,
        timer: !1,
        lists: [],
        $wrapper: !1,
        constructor: function(b, c, d) {
            this.lists = [], this.running = !1, this.base(d), this.$wrapper = a(b).addClass(this.classes.wrapper), 
            this.time = new FlipClock.Time(this, c ? Math.round(c) : 0), this.timer = new FlipClock.Timer(this, d), 
            this.lang = this.loadLanguage(this.language), this.face = this.loadClockFace(this.clockFace, d), 
            this.autoStart && this.start();
        },
        loadClockFace: function(a, b) {
            var c, d = "Face";
            return a = a.ucfirst() + d, c = FlipClock[a] ? new FlipClock[a](this, b) : new FlipClock[this.defaultClockFace + d](this, b), 
            c.build(), c;
        },
        loadLanguage: function(a) {
            var b;
            return b = FlipClock.Lang[a.ucfirst()] ? FlipClock.Lang[a.ucfirst()] : FlipClock.Lang[a] ? FlipClock.Lang[a] : FlipClock.Lang[this.defaultLanguage];
        },
        localize: function(a, b) {
            var c = this.lang;
            if (!a) return null;
            var d = a.toLowerCase();
            return "object" == typeof b && (c = b), c && c[d] ? c[d] : a;
        },
        start: function(a) {
            var b = this;
            b.running || b.countdown && !(b.countdown && b.time.time > 0) ? b.log("Trying to start timer when countdown already at 0") : (b.face.start(b.time), 
            b.timer.start(function() {
                b.flip(), "function" == typeof a && a();
            }));
        },
        stop: function(a) {
            this.face.stop(), this.timer.stop(a);
            for (var b in this.lists) this.lists[b].stop();
        },
        reset: function(a) {
            this.timer.reset(a), this.face.reset();
        },
        setTime: function(a) {
            this.time.time = a, this.face.setTime(a);
        },
        getTime: function(a) {
            return this.time;
        },
        setCountdown: function(a) {
            var b = this.running;
            this.countdown = a ? !0 : !1, b && (this.stop(), this.start());
        },
        flip: function() {
            this.face.flip();
        }
    }), FlipClock.Face = FlipClock.Base.extend({
        dividers: [],
        factory: !1,
        lists: [],
        constructor: function(a, b) {
            this.base(b), this.factory = a, this.dividers = [];
        },
        build: function() {},
        createDivider: function(b, c, d) {
            "boolean" != typeof c && c || (d = c, c = b);
            var e = [ '<span class="' + this.factory.classes.dot + ' top"></span>', '<span class="' + this.factory.classes.dot + ' bottom"></span>' ].join("");
            d && (e = ""), b = this.factory.localize(b);
            var f = [ '<span class="' + this.factory.classes.divider + " " + (c ? c : "").toLowerCase() + '">', '<span class="' + this.factory.classes.label + '">' + (b ? b : "") + "</span>", e, "</span>" ];
            return a(f.join(""));
        },
        createList: function(a, b) {
            "object" == typeof a && (b = a, a = 0);
            var c = new FlipClock.List(this.factory, a, b);
            return c;
        },
        reset: function() {},
        setTime: function(a) {
            this.flip(a);
        },
        addDigit: function(a) {
            var b = this.createList(a, {
                classes: {
                    active: this.factory.classes.active,
                    before: this.factory.classes.before
                }
            });
            b.$obj.insertBefore(this.factory.lists[0].$obj), this.factory.lists.unshift(b);
        },
        start: function() {},
        stop: function() {},
        flip: function(b, c) {
            var d = this;
            c || (d.factory.countdown ? (d.factory.time.time <= 0 && d.factory.stop(), d.factory.time.time--) : d.factory.time.time++);
            var e = d.factory.lists.length - b.length;
            0 > e && (e = 0);
            var f = !1;
            a.each(b, function(a, b) {
                a += e;
                var g = d.factory.lists[a];
                if (g) {
                    var h = g.digit;
                    g.select(b), b == h || c || g.play();
                } else d.addDigit(b), f = !0;
            });
            for (var g = 0; g < b.length; g++) g >= e && d.factory.lists[g].digit != b[g] && d.factory.lists[g].select(b[g]);
        }
    }), FlipClock.List = FlipClock.Base.extend({
        digit: 0,
        classes: {
            active: "flip-clock-active",
            before: "flip-clock-before",
            flip: "flip"
        },
        factory: !1,
        $obj: !1,
        items: [],
        constructor: function(a, b, c) {
            this.factory = a, this.digit = b, this.$obj = this.createList(), b > 0 && this.select(b), 
            this.factory.$wrapper.append(this.$obj);
        },
        select: function(a) {
            "undefined" == typeof a ? a = this.digit : this.digit = a;
            var b = this.$obj.find('[data-digit="' + a + '"]');
            this.$obj.find("." + this.classes.active).removeClass(this.classes.active), this.$obj.find("." + this.classes.before).removeClass(this.classes.before);
            this.factory.countdown ? b.is(":last-child") ? this.$obj.find(":first-child").addClass(this.classes.before) : b.next().addClass(this.classes.before) : b.is(":first-child") ? this.$obj.find(":last-child").addClass(this.classes.before) : b.prev().addClass(this.classes.before), 
            b.addClass(this.classes.active);
        },
        play: function() {
            this.$obj.addClass(this.factory.classes.play);
        },
        stop: function() {
            var a = this;
            setTimeout(function() {
                a.$obj.removeClass(a.factory.classes.play);
            }, this.factory.timer.interval);
        },
        createList: function() {
            for (var b = a('<ul class="' + this.classes.flip + " " + (this.factory.running ? this.factory.classes.play : "") + '" />'), c = 0; 10 > c; c++) {
                var d = a([ '<li data-digit="' + c + '">', '<a href="#">', '<div class="up">', '<div class="shadow"></div>', '<div class="inn">' + c + "</div>", "</div>", '<div class="down">', '<div class="shadow"></div>', '<div class="inn">' + c + "</div>", "</div>", "</a>", "</li>" ].join(""));
                this.items.push(d), b.append(d);
            }
            return b;
        }
    }), FlipClock.Time = FlipClock.Base.extend({
        minimumDigits: 0,
        time: 0,
        factory: !1,
        constructor: function(a, b, c) {
            this.base(c), this.factory = a, b && (this.time = b);
        },
        convertDigitsToArray: function(a) {
            var b = [];
            a = a.toString();
            for (var c = 0; c < a.length; c++) a[c].match(/^\d*$/g) && b.push(a[c]);
            return b;
        },
        digit: function(a) {
            var b = this.toString(), c = b.length;
            return b[c - a] ? b[c - a] : !1;
        },
        digitize: function(b) {
            var c = [];
            return a.each(b, function(a, b) {
                b = b.toString(), 1 == b.length && (b = "0" + b);
                for (var d = 0; d < b.length; d++) c.push(b[d]);
            }), c.length > this.minimumDigits && (this.minimumDigits = c.length), this.minimumDigits > c.length && c.unshift("0"), 
            c;
        },
        getDayCounter: function(a) {
            var b = [ this.getDays(), this.getHours(!0), this.getMinutes(!0) ];
            return a && b.push(this.getSeconds(!0)), this.digitize(b);
        },
        getDays: function(a) {
            var b = this.time / 60 / 60 / 24;
            return a && (b %= 7), Math.floor(b);
        },
        getHourCounter: function() {
            var a = this.digitize([ this.getHours(), this.getMinutes(!0), this.getSeconds(!0) ]);
            return a;
        },
        getHourly: function() {
            return this.getHourCounter();
        },
        getHours: function(a) {
            var b = this.time / 60 / 60;
            return a && (b %= 24), Math.floor(b);
        },
        getMilitaryTime: function() {
            var a = new Date(), b = this.digitize([ a.getHours(), a.getMinutes(), a.getSeconds() ]);
            return b;
        },
        getMinutes: function(a) {
            var b = this.time / 60;
            return a && (b %= 60), Math.floor(b);
        },
        getMinuteCounter: function() {
            var a = this.digitize([ this.getMinutes(), this.getSeconds(!0) ]);
            return a;
        },
        getSeconds: function(a) {
            var b = this.time;
            return a && (60 == b ? b = 0 : b %= 60), Math.ceil(b);
        },
        getTime: function() {
            var a = new Date(), b = a.getHours(), c = this.digitize([ b > 12 ? b - 12 : 0 === b ? 12 : b, a.getMinutes(), a.getSeconds() ]);
            return c;
        },
        getWeeks: function() {
            var a = this.time / 60 / 60 / 24 / 7;
            return mod && (a %= 52), Math.floor(a);
        },
        removeLeadingZeros: function(b, c) {
            var d = 0, e = [];
            return a.each(c, function(a, f) {
                b > a ? d += parseInt(c[a], 10) : e.push(c[a]);
            }), 0 === d ? e : c;
        },
        toString: function() {
            return this.time.toString();
        }
    }), FlipClock.Timer = FlipClock.Base.extend({
        callbacks: {
            destroy: !1,
            create: !1,
            init: !1,
            interval: !1,
            start: !1,
            stop: !1,
            reset: !1
        },
        count: 0,
        factory: !1,
        interval: 1e3,
        constructor: function(a, b) {
            this.base(b), this.factory = a, this.callback(this.callbacks.init), this.callback(this.callbacks.create);
        },
        getElapsed: function() {
            return this.count * this.interval;
        },
        getElapsedTime: function() {
            return new Date(this.time + this.getElapsed());
        },
        reset: function(a) {
            clearInterval(this.timer), this.count = 0, this._setInterval(a), this.callback(this.callbacks.reset);
        },
        start: function(a) {
            this.factory.running = !0, this._createTimer(a), this.callback(this.callbacks.start);
        },
        stop: function(a) {
            this.factory.running = !1, this._clearInterval(a), this.callback(this.callbacks.stop), 
            this.callback(a);
        },
        _clearInterval: function() {
            clearInterval(this.timer);
        },
        _createTimer: function(a) {
            this._setInterval(a);
        },
        _destroyTimer: function(a) {
            this._clearInterval(), this.timer = !1, this.callback(a), this.callback(this.callbacks.destroy);
        },
        _interval: function(a) {
            this.callback(this.callbacks.interval), this.callback(a), this.count++;
        },
        _setInterval: function(a) {
            var b = this;
            b.timer = setInterval(function() {
                b._interval(a);
            }, this.interval);
        }
    }), String.prototype.ucfirst = function() {
        return this.substr(0, 1).toUpperCase() + this.substr(1);
    }, a.fn.FlipClock = function(b, c) {
        return "object" == typeof b && (c = b, b = 0), new FlipClock(a(this), b, c);
    }, a.fn.flipClock = function(b, c) {
        return a.fn.FlipClock(b, c);
    };
}(jQuery), function(a) {
    FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({
        constructor: function(a, b) {
            a.countdown = !1, this.base(a, b);
        },
        build: function(b) {
            var c = this, d = this.factory.$wrapper.find("ul");
            b = b ? b : this.factory.time.time || this.factory.time.getMilitaryTime(), b.length > d.length && a.each(b, function(a, b) {
                c.factory.lists.push(c.createList(b));
            }), this.dividers.push(this.createDivider()), this.dividers.push(this.createDivider()), 
            a(this.dividers[0]).insertBefore(this.factory.lists[this.factory.lists.length - 2].$obj), 
            a(this.dividers[1]).insertBefore(this.factory.lists[this.factory.lists.length - 4].$obj), 
            this._clearExcessDigits(), this.autoStart && this.start();
        },
        flip: function(a) {
            a = a ? a : this.factory.time.getMilitaryTime(), this.base(a);
        },
        _clearExcessDigits: function() {
            for (var a = this.factory.lists[this.factory.lists.length - 2], b = this.factory.lists[this.factory.lists.length - 4], c = 6; 10 > c; c++) a.$obj.find("li:last-child").remove(), 
            b.$obj.find("li:last-child").remove();
        }
    });
}(jQuery), function(a) {
    FlipClock.CounterFace = FlipClock.Face.extend({
        autoStart: !1,
        constructor: function(a, b) {
            a.timer.interval = 0, a.autoStart = !1, a.running = !0, a.increment = function() {
                a.countdown = !1, a.setTime(a.getTime().time + 1);
            }, a.decrement = function() {
                a.countdown = !0, a.setTime(a.getTime().time - 1);
            }, a.setValue = function(b) {
                a.setTime(b);
            }, a.setCounter = function(b) {
                a.setTime(b);
            }, this.base(a, b);
        },
        build: function() {
            var b = this, c = this.factory.$wrapper.find("ul"), d = [], e = this.factory.getTime().digitize([ this.factory.getTime().time ]);
            e.length > c.length && a.each(e, function(a, c) {
                var e = b.createList(c);
                e.select(c), d.push(e);
            }), a.each(d, function(a, b) {
                b.play();
            }), this.factory.lists = d;
        },
        flip: function(a) {
            var b = this.factory.getTime().digitize([ this.factory.getTime().time ]);
            this.base(b, a);
        }
    });
}(jQuery), function(a) {
    FlipClock.DailyCounterFace = FlipClock.Face.extend({
        showSeconds: !0,
        constructor: function(a, b) {
            this.base(a, b);
        },
        build: function(b, c) {
            var d = this, e = this.factory.$wrapper.find("ul"), f = [], g = 0;
            c = c ? c : this.factory.time.getDayCounter(this.showSeconds), c.length > e.length && a.each(c, function(a, b) {
                f.push(d.createList(b));
            }), this.factory.lists = f, this.showSeconds ? a(this.createDivider("secs")).insertBefore(this.factory.lists[this.factory.lists.length - 2].$obj) : g = 2, 
            a(this.createDivider("mins")).insertBefore(this.factory.lists[this.factory.lists.length - 4 + g].$obj), 
            a(this.createDivider("hrs")).insertBefore(this.factory.lists[this.factory.lists.length - 6 + g].$obj), 
            a(this.createDivider("days", !0)).insertBefore(this.factory.lists[0].$obj), this._clearExcessDigits(), 
            this.autoStart && this.start();
        },
        flip: function(a, b) {
            b || (b = this.factory.time.getDayCounter(this.showSeconds)), this.base(b, a);
        },
        _clearExcessDigits: function() {
            for (var a = this.factory.lists[this.factory.lists.length - 2], b = this.factory.lists[this.factory.lists.length - 4], c = 6; 10 > c; c++) a.$obj.find("li:last-child").remove(), 
            b.$obj.find("li:last-child").remove();
        }
    });
}(jQuery), function(a) {
    FlipClock.HourlyCounterFace = FlipClock.Face.extend({
        clearExcessDigits: !0,
        constructor: function(a, b) {
            this.base(a, b);
        },
        build: function(b, c) {
            var d = this, e = this.factory.$wrapper.find("ul"), f = [];
            c = c ? c : this.factory.time.getHourCounter(), c.length > e.length && a.each(c, function(a, b) {
                f.push(d.createList(b));
            }), this.factory.lists = f, a(this.createDivider("Seconds")).insertBefore(this.factory.lists[this.factory.lists.length - 2].$obj), 
            a(this.createDivider("Minutes")).insertBefore(this.factory.lists[this.factory.lists.length - 4].$obj), 
            b || a(this.createDivider("Hours", !0)).insertBefore(this.factory.lists[0].$obj), 
            this.clearExcessDigits && this._clearExcessDigits(), this.autoStart && this.start();
        },
        flip: function(a, b) {
            b || (b = this.factory.time.getHourCounter()), this.base(b, a);
        },
        _clearExcessDigits: function() {
            for (var a = this.factory.lists[this.factory.lists.length - 2], b = this.factory.lists[this.factory.lists.length - 4], c = 6; 10 > c; c++) a.$obj.find("li:last-child").remove(), 
            b.$obj.find("li:last-child").remove();
        }
    });
}(jQuery), function(a) {
    FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({
        clearExcessDigits: !1,
        constructor: function(a, b) {
            this.base(a, b);
        },
        build: function() {
            this.base(!0, this.factory.time.getMinuteCounter());
        },
        flip: function(a) {
            this.base(a, this.factory.time.getMinuteCounter());
        }
    });
}(jQuery), function(a) {
    FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({
        meridium: !1,
        meridiumText: "AM",
        build: function(b) {
            b = b ? b : this.factory.time.time ? this.factory.time.time : this.factory.time.getTime(), 
            this.base(b), this.meridiumText = this._isPM() ? "PM" : "AM", this.meridium = a([ '<ul class="flip-clock-meridium">', "<li>", '<a href="#">' + this.meridiumText + "</a>", "</li>", "</ul>" ].join("")), 
            this.meridium.insertAfter(this.factory.lists[this.factory.lists.length - 1].$obj);
        },
        flip: function() {
            this.meridiumText != this._getMeridium() && (this.meridiumText = this._getMeridium(), 
            this.meridium.find("a").html(this.meridiumText)), this.base(this.factory.time.getTime());
        },
        _getMeridium: function() {
            return new Date().getHours() >= 12 ? "PM" : "AM";
        },
        _isPM: function() {
            return "PM" == this._getMeridium() ? !0 : !1;
        },
        _clearExcessDigits: function() {
            for (var a = this.factory.lists[this.factory.lists.length - 2], b = this.factory.lists[this.factory.lists.length - 4], c = 6; 10 > c; c++) a.$obj.find("li:last-child").remove(), 
            b.$obj.find("li:last-child").remove();
        }
    });
}(jQuery), function(a) {
    FlipClock.Lang.German = {
        years: "Jahre",
        months: "Monate",
        days: "Tage",
        hours: "Stunden",
        minutes: "Minuten",
        seconds: "Sekunden"
    }, FlipClock.Lang.de = FlipClock.Lang.German, FlipClock.Lang["de-de"] = FlipClock.Lang.German, 
    FlipClock.Lang.german = FlipClock.Lang.German;
}(jQuery), function(a) {
    FlipClock.Lang.English = {
        years: "Years",
        months: "Months",
        days: "days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds"
    }, FlipClock.Lang.en = FlipClock.Lang.English, FlipClock.Lang["en-us"] = FlipClock.Lang.English, 
    FlipClock.Lang.english = FlipClock.Lang.English;
}(jQuery), function(a) {
    FlipClock.Lang.Spanish = {
        years: "A&#241;os",
        months: "Meses",
        days: "D&#205;as",
        hours: "Horas",
        minutes: "Minutos",
        seconds: "Segundo"
    }, FlipClock.Lang.es = FlipClock.Lang.Spanish, FlipClock.Lang["es-es"] = FlipClock.Lang.Spanish, 
    FlipClock.Lang.spanish = FlipClock.Lang.Spanish;
}(jQuery), function(a) {
    FlipClock.Lang.French = {
        years: "ans",
        months: "mois",
        days: "jours",
        hours: "heures",
        minutes: "minutes",
        seconds: "secondes"
    }, FlipClock.Lang.fr = FlipClock.Lang.French, FlipClock.Lang["fr-ca"] = FlipClock.Lang.French, 
    FlipClock.Lang.french = FlipClock.Lang.French;
}(jQuery), function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                throw new Error("Cannot find module '" + g + "'");
            }
            var j = c[g] = {
                exports: {}
            };
            b[g][0].call(j.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a);
            }, j, j.exports, a, b, c, d);
        }
        return c[g].exports;
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e;
}({
    1: [ function(a, b, c) {
        function d(a) {
            var b, c = a.attributes, d = c.length, e = 0, f = {};
            if (0 === d) return {};
            for (;b = c[e++]; ) f[b.name] = b.value;
            return f;
        }
        b.exports = d;
    }, {} ],
    2: [ function(a, b, c) {
        function d(a, b) {
            for (var c, d = 0, e = [ "matches", "matchesSelector", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector" ]; c = e[d++]; ) if ("function" == typeof a[c]) return a[c](b);
            throw new Error("You are using a browser that doesn't not support element.matches() or element.matchesSelector()");
        }
        function e(a, b) {
            return null == b ? !1 : ("string" == typeof b || b.nodeType ? b = [ b ] : "length" in b && (b = f(b)), 
            b.some(function(b) {
                return "string" == typeof b ? d(a, b) : a === b;
            }));
        }
        var f = a("mout/lang/toArray");
        b.exports = e;
    }, {
        "mout/lang/toArray": 13
    } ],
    3: [ function(a, b, c) {
        function d(a) {
            for (var b = []; a.parentNode && 1 == a.parentNode.nodeType; ) b.push(a = a.parentNode);
            return b;
        }
        b.exports = d;
    }, {} ],
    4: [ function(a, b, c) {
        function d(a, b, c) {
            b = e(b, c);
            var d = [];
            if (null == a) return d;
            for (var f, g = -1, h = a.length; ++g < h; ) f = a[g], b(f, g, a) && d.push(f);
            return d;
        }
        var e = a("../function/makeIterator_");
        b.exports = d;
    }, {
        "../function/makeIterator_": 7
    } ],
    5: [ function(a, b, c) {
        function d(a, b) {
            return b = b || e, f(a, function(a, c, d) {
                for (var e = d.length; ++c < e; ) if (b(a, d[c])) return !1;
                return !0;
            });
        }
        function e(a, b) {
            return a === b;
        }
        var f = a("./filter");
        b.exports = d;
    }, {
        "./filter": 4
    } ],
    6: [ function(a, b, c) {
        function d(a) {
            return a;
        }
        b.exports = d;
    }, {} ],
    7: [ function(a, b, c) {
        function d(a, b) {
            if (null == a) return e;
            switch (typeof a) {
              case "function":
                return "undefined" != typeof b ? function(c, d, e) {
                    return a.call(b, c, d, e);
                } : a;

              case "object":
                return function(b) {
                    return g(b, a);
                };

              case "string":
              case "number":
                return f(a);
            }
        }
        var e = a("./identity"), f = a("./prop"), g = a("../object/deepMatches");
        b.exports = d;
    }, {
        "../object/deepMatches": 14,
        "./identity": 6,
        "./prop": 8
    } ],
    8: [ function(a, b, c) {
        function d(a) {
            return function(b) {
                return b[a];
            };
        }
        b.exports = d;
    }, {} ],
    9: [ function(a, b, c) {
        var d = a("./isKind"), e = Array.isArray || function(a) {
            return d(a, "Array");
        };
        b.exports = e;
    }, {
        "./isKind": 10
    } ],
    10: [ function(a, b, c) {
        function d(a, b) {
            return e(a) === b;
        }
        var e = a("./kindOf");
        b.exports = d;
    }, {
        "./kindOf": 12
    } ],
    11: [ function(a, b, c) {
        function d(a) {
            return e(a, "RegExp");
        }
        var e = a("./isKind");
        b.exports = d;
    }, {
        "./isKind": 10
    } ],
    12: [ function(a, b, c) {
        function d(a) {
            return null === a ? "Null" : a === e ? "Undefined" : f.exec(g.call(a))[1];
        }
        var e, f = /^\[object (.*)\]$/, g = Object.prototype.toString;
        b.exports = d;
    }, {} ],
    13: [ function(a, b, c) {
        function d(a) {
            var b, c = [], d = e(a);
            if (null != a) if (null == a.length || "String" === d || "Function" === d || "RegExp" === d || a === f) c[c.length] = a; else for (b = a.length; b--; ) c[b] = a[b];
            return c;
        }
        var e = a("./kindOf"), f = this;
        b.exports = d;
    }, {
        "./kindOf": 12
    } ],
    14: [ function(a, b, c) {
        function d(a, b) {
            for (var c = -1, d = a.length; ++c < d; ) if (g(a[c], b)) return !0;
            return !1;
        }
        function e(a, b) {
            for (var c = -1, e = b.length; ++c < e; ) if (!d(a, b[c])) return !1;
            return !0;
        }
        function f(a, b) {
            var c = !0;
            return h(b, function(b, d) {
                return g(a[d], b) ? void 0 : c = !1;
            }), c;
        }
        function g(a, b) {
            return a && "object" == typeof a ? i(a) && i(b) ? e(a, b) : f(a, b) : a === b;
        }
        var h = a("./forOwn"), i = a("../lang/isArray");
        b.exports = g;
    }, {
        "../lang/isArray": 9,
        "./forOwn": 16
    } ],
    15: [ function(a, b, c) {
        function d() {
            h = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], 
            g = !0;
            for (var a in {
                toString: null
            }) g = !1;
        }
        function e(a, b, c) {
            var e, j = 0;
            null == g && d();
            for (e in a) if (f(b, a, e, c) === !1) break;
            if (g) for (var k = a.constructor, l = !!k && a === k.prototype; (e = h[j++]) && ("constructor" === e && (l || !i(a, e)) || a[e] === Object.prototype[e] || f(b, a, e, c) !== !1); ) ;
        }
        function f(a, b, c, d) {
            return a.call(d, b[c], c, b);
        }
        var g, h, i = a("./hasOwn");
        b.exports = e;
    }, {
        "./hasOwn": 17
    } ],
    16: [ function(a, b, c) {
        function d(a, b, c) {
            f(a, function(d, f) {
                return e(a, f) ? b.call(c, a[f], f, a) : void 0;
            });
        }
        var e = a("./hasOwn"), f = a("./forIn");
        b.exports = d;
    }, {
        "./forIn": 15,
        "./hasOwn": 17
    } ],
    17: [ function(a, b, c) {
        function d(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        }
        b.exports = d;
    }, {} ],
    18: [ function(a, b, c) {
        function d(a, b) {
            for (var c, d = 0, g = arguments.length; ++d < g; ) c = arguments[d], null != c && f(c, e, a);
            return a;
        }
        function e(a, b) {
            this[b] = a;
        }
        var f = a("./forOwn");
        b.exports = d;
    }, {
        "./forOwn": 16
    } ],
    19: [ function(a, b, c) {
        function d() {
            this.handlers = [];
        }
        d.prototype.add = function(a) {
            this.handlers.push(a);
        }, d.prototype.remove = function(a) {
            this.handlers = this.handlers.filter(function(b) {
                return b != a;
            });
        }, d.prototype.fire = function(a, b) {
            this.handlers.forEach(function(c) {
                c.apply(a, b);
            });
        }, b.exports = d;
    }, {} ],
    20: [ function(a, b, c) {
        function d(a, b, c, d) {
            var e = null == c ? Object.keys(q.rules) : c;
            d && (e = e.filter(function(a) {
                return d.indexOf(a) < 0;
            })), e.forEach(function(c) {
                q.rules[c] && q.rules[c].func.call(q, a, b, q.rules[c].config);
            });
        }
        function e(a, b, c, d) {
            if (1 == b.nodeType) {
                var f = o(b);
                n(b, c) || (a.trigger("element", b, [ b.nodeName.toLowerCase(), b ]), b.id && a.trigger("id", b, [ b.id, b ]), 
                l(b.classList).forEach(function(c) {
                    a.trigger("class", b, [ c, b ]);
                }), Object.keys(f).sort().forEach(function(c) {
                    a.trigger("attribute", b, [ c, f[c], b ]);
                })), n(b, d) || l(b.childNodes).forEach(function(b) {
                    e(a, b, c, d);
                });
            }
        }
        function f(a) {
            return a && ("string" == typeof a || 1 == a.nodeType ? a = {
                domRoot: a
            } : Array.isArray(a) ? a = {
                useRules: a
            } : "function" == typeof a && (a = {
                onComplete: a
            })), a = m({}, q.defaults, a), a.domRoot = "string" == typeof a.domRoot ? document.querySelector(a.domRoot) : a.domRoot, 
            a;
        }
        function g(a) {
            return Array.isArray(a) || (a = [ a ]), a = a.map(function(a) {
                return a && a.nodeName && "iframe" == a.nodeName.toLowerCase() && p(a.src) ? "(can't display iframe with cross-origin source: " + a.src + ")" : a;
            }), 1 === a.length ? a[0] : a;
        }
        var h = a("./listener"), i = a("./modules"), j = a("./reporter"), k = a("./rules"), l = a("mout/lang/toArray"), m = (a("mout/lang/isRegExp"), 
        a("mout/array/unique"), a("mout/object/mixIn")), n = a("dom-utils/src/matches"), o = a("dom-utils/src/get-attributes"), p = a("./utils/cross-origin"), q = {
            defaults: {
                domRoot: "html",
                useRules: null,
                excludeRules: null,
                excludeElements: "svg",
                excludeSubTrees: [ "svg", "iframe" ],
                onComplete: function(a) {
                    a.forEach(function(a) {
                        console.warn(a.message, g(a.context));
                    });
                }
            },
            rules: new k(),
            modules: new i(),
            inspect: function(a) {
                var b = f(a), c = new h(), g = new j();
                d(c, g, b.useRules, b.excludeRules), c.trigger("beforeInspect", b.domRoot), e(c, b.domRoot, b.excludeElements, b.excludeSubTrees), 
                c.trigger("afterInspect", b.domRoot), b.onComplete(g.getWarnings());
            }
        };
        q.modules.add(a("./modules/css.js")), q.modules.add(a("./modules/validation.js")), 
        q.rules.add(a("./rules/best-practices/inline-event-handlers.js")), q.rules.add(a("./rules/best-practices/script-placement.js")), 
        q.rules.add(a("./rules/best-practices/unnecessary-elements.js")), q.rules.add(a("./rules/best-practices/unused-classes.js")), 
        q.rules.add(a("./rules/convention/bem-conventions.js")), q.rules.add(a("./rules/validation/duplicate-ids.js")), 
        q.rules.add(a("./rules/validation/unique-elements.js")), q.rules.add(a("./rules/validation/validate-attributes.js")), 
        q.rules.add(a("./rules/validation/validate-element-location.js")), q.rules.add(a("./rules/validation/validate-elements.js")), 
        window.HTMLInspector = q;
    }, {
        "./listener": 21,
        "./modules": 22,
        "./modules/css.js": 23,
        "./modules/validation.js": 24,
        "./reporter": 25,
        "./rules": 26,
        "./rules/best-practices/inline-event-handlers.js": 27,
        "./rules/best-practices/script-placement.js": 28,
        "./rules/best-practices/unnecessary-elements.js": 29,
        "./rules/best-practices/unused-classes.js": 30,
        "./rules/convention/bem-conventions.js": 31,
        "./rules/validation/duplicate-ids.js": 32,
        "./rules/validation/unique-elements.js": 33,
        "./rules/validation/validate-attributes.js": 34,
        "./rules/validation/validate-element-location.js": 35,
        "./rules/validation/validate-elements.js": 36,
        "./utils/cross-origin": 37,
        "dom-utils/src/get-attributes": 1,
        "dom-utils/src/matches": 2,
        "mout/array/unique": 5,
        "mout/lang/isRegExp": 11,
        "mout/lang/toArray": 13,
        "mout/object/mixIn": 18
    } ],
    21: [ function(a, b, c) {
        function d() {
            this._events = {};
        }
        var e = a("./callbacks");
        d.prototype.on = function(a, b) {
            this._events[a] || (this._events[a] = new e()), this._events[a].add(b);
        }, d.prototype.off = function(a, b) {
            this._events[a] && this._events[a].remove(b);
        }, d.prototype.trigger = function(a, b, c) {
            this._events[a] && this._events[a].fire(b, c);
        }, b.exports = d;
    }, {
        "./callbacks": 19
    } ],
    22: [ function(a, b, c) {
        function d() {}
        var e = a("mout/object/mixIn");
        d.prototype.add = function(a) {
            this[a.name] = a.module;
        }, d.prototype.extend = function(a, b) {
            "function" == typeof b && (b = b.call(this[a], this[a])), e(this[a], b);
        }, b.exports = d;
    }, {
        "mout/object/mixIn": 18
    } ],
    23: [ function(a, b, c) {
        function d(a) {
            return a.reduce(function(a, b) {
                var c;
                return b.styleSheet ? a.concat(e([ b.styleSheet ])) : b.cssRules ? a.concat(d(h(b.cssRules))) : b.selectorText ? (c = b.selectorText.match(g) || [], 
                a.concat(c.map(function(a) {
                    return a.slice(1);
                }))) : a;
            }, []);
        }
        function e(a) {
            return a.reduce(function(a, b) {
                return b.href && k(b.href) ? a : a.concat(d(h(b.cssRules)));
            }, []);
        }
        function f() {
            return h(document.styleSheets).filter(function(a) {
                return j(a.ownerNode, l.styleSheets);
            });
        }
        var g = /\.[a-z0-9_\-]+/gi, h = a("mout/lang/toArray"), i = a("mout/array/unique"), j = a("dom-utils/src/matches"), k = a("../utils/cross-origin"), l = {
            getClassSelectors: function() {
                return i(e(f()));
            },
            styleSheets: 'link[rel="stylesheet"], style'
        };
        b.exports = {
            name: "css",
            module: l
        };
    }, {
        "../utils/cross-origin": 37,
        "dom-utils/src/matches": 2,
        "mout/array/unique": 5,
        "mout/lang/toArray": 13
    } ],
    24: [ function(a, b, c) {
        function d(a) {
            return h[a] ? h[a].attributes.replace(/\*/g, "").split(/\s*;\s*/) : [];
        }
        function e(a) {
            return g(a, j);
        }
        function f(a) {
            var b, c = [];
            return b = h[a].children, b = b.indexOf("*") >= 0 ? [] : b.split(/\s*\;\s*/), b.forEach(function(a) {
                i[a] ? (c = c.concat(i[a].elements), c = c.concat(i[a].exceptions || [])) : c.push(a);
            }), c.length ? c : [ /[\s\S]+/ ];
        }
        var g = a("../utils/string-matcher"), h = {
            a: {
                children: "transparent*",
                attributes: "globals; href; target; download; rel; hreflang; type"
            },
            abbr: {
                children: "phrasing",
                attributes: "globals"
            },
            address: {
                children: "flow*",
                attributes: "globals"
            },
            area: {
                children: "empty",
                attributes: "globals; alt; coords; shape; href; target; download; rel; hreflang; type"
            },
            article: {
                children: "flow",
                attributes: "globals"
            },
            aside: {
                children: "flow",
                attributes: "globals"
            },
            audio: {
                children: "source*; transparent*",
                attributes: "globals; src; crossorigin; preload; autoplay; mediagroup; loop; muted; controls"
            },
            b: {
                children: "phrasing",
                attributes: "globals"
            },
            base: {
                children: "empty",
                attributes: "globals; href; target"
            },
            bdi: {
                children: "phrasing",
                attributes: "globals"
            },
            bdo: {
                children: "phrasing",
                attributes: "globals"
            },
            blockquote: {
                children: "flow",
                attributes: "globals; cite"
            },
            body: {
                children: "flow",
                attributes: "globals; onafterprint; onbeforeprint; onbeforeunload; onfullscreenchange; onfullscreenerror; onhashchange; onmessage; onoffline; ononline; onpagehide; onpageshow; onpopstate; onresize; onstorage; onunload"
            },
            br: {
                children: "empty",
                attributes: "globals"
            },
            button: {
                children: "phrasing*",
                attributes: "globals; autofocus; disabled; form; formaction; formenctype; formmethod; formnovalidate; formtarget; name; type; value"
            },
            canvas: {
                children: "transparent",
                attributes: "globals; width; height"
            },
            caption: {
                children: "flow*",
                attributes: "globals"
            },
            cite: {
                children: "phrasing",
                attributes: "globals"
            },
            code: {
                children: "phrasing",
                attributes: "globals"
            },
            col: {
                children: "empty",
                attributes: "globals; span"
            },
            colgroup: {
                children: "col",
                attributes: "globals; span"
            },
            menuitem: {
                children: "empty",
                attributes: "globals; type; label; icon; disabled; checked; radiogroup; command"
            },
            data: {
                children: "phrasing",
                attributes: "globals; value"
            },
            datalist: {
                children: "phrasing; option",
                attributes: "globals"
            },
            dd: {
                children: "flow",
                attributes: "globals"
            },
            del: {
                children: "transparent",
                attributes: "globals; cite; datetime"
            },
            details: {
                children: "summary*; flow",
                attributes: "globals; open"
            },
            dfn: {
                children: "phrasing*",
                attributes: "globals"
            },
            dialog: {
                children: "flow",
                attributes: "globals; open"
            },
            div: {
                children: "flow",
                attributes: "globals"
            },
            dl: {
                children: "dt*; dd*",
                attributes: "globals"
            },
            dt: {
                children: "flow*",
                attributes: "globals"
            },
            em: {
                children: "phrasing",
                attributes: "globals"
            },
            embed: {
                children: "empty",
                attributes: "globals; src; type; width; height; any*"
            },
            fieldset: {
                children: "legend*; flow",
                attributes: "globals; disabled; form; name"
            },
            figcaption: {
                children: "flow",
                attributes: "globals"
            },
            figure: {
                children: "figcaption*; flow",
                attributes: "globals"
            },
            footer: {
                children: "flow*",
                attributes: "globals"
            },
            form: {
                children: "flow*",
                attributes: "globals; accept-charset; action; autocomplete; enctype; method; name; novalidate; target"
            },
            h1: {
                children: "phrasing",
                attributes: "globals"
            },
            h2: {
                children: "phrasing",
                attributes: "globals"
            },
            h3: {
                children: "phrasing",
                attributes: "globals"
            },
            h4: {
                children: "phrasing",
                attributes: "globals"
            },
            h5: {
                children: "phrasing",
                attributes: "globals"
            },
            h6: {
                children: "phrasing",
                attributes: "globals"
            },
            head: {
                children: "metadata content*",
                attributes: "globals"
            },
            header: {
                children: "flow*",
                attributes: "globals"
            },
            hr: {
                children: "empty",
                attributes: "globals"
            },
            html: {
                children: "head*; body*",
                attributes: "globals; manifest"
            },
            i: {
                children: "phrasing",
                attributes: "globals"
            },
            iframe: {
                children: "text*",
                attributes: "globals; src; srcdoc; name; sandbox; seamless; allowfullscreen; width; height"
            },
            img: {
                children: "empty",
                attributes: "globals; alt; src; crossorigin; usemap; ismap; width; height"
            },
            input: {
                children: "empty",
                attributes: "globals; accept; alt; autocomplete; autofocus; checked; dirname; disabled; form; formaction; formenctype; formmethod; formnovalidate; formtarget; height; list; max; maxlength; min; multiple; name; pattern; placeholder; readonly; required; size; src; step; type; value; width"
            },
            ins: {
                children: "transparent",
                attributes: "globals; cite; datetime"
            },
            kbd: {
                children: "phrasing",
                attributes: "globals"
            },
            keygen: {
                children: "empty",
                attributes: "globals; autofocus; challenge; disabled; form; keytype; name"
            },
            label: {
                children: "phrasing*",
                attributes: "globals; form; for"
            },
            legend: {
                children: "phrasing",
                attributes: "globals"
            },
            li: {
                children: "flow",
                attributes: "globals; value*"
            },
            link: {
                children: "empty",
                attributes: "globals; href; crossorigin; rel; media; hreflang; type; sizes"
            },
            main: {
                children: "flow*",
                attributes: "globals"
            },
            map: {
                children: "transparent; area*",
                attributes: "globals; name"
            },
            mark: {
                children: "phrasing",
                attributes: "globals"
            },
            menu: {
                children: "li*; flow*; menuitem*; hr*; menu*",
                attributes: "globals; type; label"
            },
            meta: {
                children: "empty",
                attributes: "globals; name; http-equiv; content; charset"
            },
            meter: {
                children: "phrasing*",
                attributes: "globals; value; min; max; low; high; optimum"
            },
            nav: {
                children: "flow",
                attributes: "globals"
            },
            noscript: {
                children: "varies*",
                attributes: "globals"
            },
            object: {
                children: "param*; transparent",
                attributes: "globals; data; type; typemustmatch; name; usemap; form; width; height"
            },
            ol: {
                children: "li",
                attributes: "globals; reversed; start; type"
            },
            optgroup: {
                children: "option",
                attributes: "globals; disabled; label"
            },
            option: {
                children: "text*",
                attributes: "globals; disabled; label; selected; value"
            },
            output: {
                children: "phrasing",
                attributes: "globals; for; form; name"
            },
            p: {
                children: "phrasing",
                attributes: "globals"
            },
            param: {
                children: "empty",
                attributes: "globals; name; value"
            },
            pre: {
                children: "phrasing",
                attributes: "globals"
            },
            progress: {
                children: "phrasing*",
                attributes: "globals; value; max"
            },
            q: {
                children: "phrasing",
                attributes: "globals; cite"
            },
            rp: {
                children: "phrasing",
                attributes: "globals"
            },
            rt: {
                children: "phrasing",
                attributes: "globals"
            },
            ruby: {
                children: "phrasing; rt; rp*",
                attributes: "globals"
            },
            s: {
                children: "phrasing",
                attributes: "globals"
            },
            samp: {
                children: "phrasing",
                attributes: "globals"
            },
            script: {
                children: "script, data, or script documentation*",
                attributes: "globals; src; type; charset; async; defer; crossorigin"
            },
            section: {
                children: "flow",
                attributes: "globals"
            },
            select: {
                children: "option; optgroup",
                attributes: "globals; autofocus; disabled; form; multiple; name; required; size"
            },
            small: {
                children: "phrasing",
                attributes: "globals"
            },
            source: {
                children: "empty",
                attributes: "globals; src; type; media"
            },
            span: {
                children: "phrasing",
                attributes: "globals"
            },
            strong: {
                children: "phrasing",
                attributes: "globals"
            },
            style: {
                children: "varies*",
                attributes: "globals; media; type; scoped"
            },
            sub: {
                children: "phrasing",
                attributes: "globals"
            },
            summary: {
                children: "phrasing",
                attributes: "globals"
            },
            sup: {
                children: "phrasing",
                attributes: "globals"
            },
            table: {
                children: "caption*; colgroup*; thead*; tbody*; tfoot*; tr*",
                attributes: "globals; border"
            },
            tbody: {
                children: "tr",
                attributes: "globals"
            },
            td: {
                children: "flow",
                attributes: "globals; colspan; rowspan; headers"
            },
            template: {
                children: "flow; metadata",
                attributes: "globals"
            },
            textarea: {
                children: "text",
                attributes: "globals; autofocus; cols; dirname; disabled; form; maxlength; name; placeholder; readonly; required; rows; wrap"
            },
            tfoot: {
                children: "tr",
                attributes: "globals"
            },
            th: {
                children: "flow*",
                attributes: "globals; colspan; rowspan; headers; scope; abbr"
            },
            thead: {
                children: "tr",
                attributes: "globals"
            },
            time: {
                children: "phrasing",
                attributes: "globals; datetime"
            },
            title: {
                children: "text*",
                attributes: "globals"
            },
            tr: {
                children: "th*; td",
                attributes: "globals"
            },
            track: {
                children: "empty",
                attributes: "globals; default; kind; label; src; srclang"
            },
            u: {
                children: "phrasing",
                attributes: "globals"
            },
            ul: {
                children: "li",
                attributes: "globals"
            },
            "var": {
                children: "phrasing",
                attributes: "globals"
            },
            video: {
                children: "source*; transparent*",
                attributes: "globals; src; crossorigin; poster; preload; autoplay; mediagroup; loop; muted; controls; width; height"
            },
            wbr: {
                children: "empty",
                attributes: "globals"
            }
        }, i = {
            metadata: {
                elements: [ "base", "link", "meta", "noscript", "script", "style", "title" ]
            },
            flow: {
                elements: [ "a", "abbr", "address", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "details", "dfn", "dialog", "div", "dl", "em", "embed", "fieldset", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "main", "map", "mark", "math", "menu", "meter", "nav", "noscript", "object", "ol", "output", "p", "pre", "progress", "q", "ruby", "s", "samp", "script", "section", "select", "small", "span", "strong", "sub", "sup", "svg", "table", "textarea", "time", "u", "ul", "var", "video", "wbr" ],
                exceptions: [ "area", "link", "meta", "style" ],
                exceptionsSelectors: [ "map area", "link[itemprop]", "meta[itemprop]", "style[scoped]" ]
            },
            sectioning: {
                elements: [ "article", "aside", "nav", "section" ]
            },
            heading: {
                elements: [ "h1", "h2", "h3", "h4", "h5", "h6" ]
            },
            phrasing: {
                elements: [ "a", "abbr", "audio", "b", "bdi", "bdo", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "map", "mark", "math", "meter", "noscript", "object", "output", "progress", "q", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "svg", "textarea", "time", "u", "var", "video", "wbr" ],
                exceptions: [ "area", "link", "meta" ],
                exceptionsSelectors: [ "map area", "link[itemprop]", "meta[itemprop]" ]
            },
            embedded: {
                elements: [ "audio", "canvas", "embed", "iframe", "img", "math", "object", "svg", "video" ]
            },
            interactive: {
                elements: [ "a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea" ],
                exceptions: [ "audio", "img", "input", "object", "video" ],
                exceptionsSelectors: [ "audio[controls]", "img[usemap]", "input:not([type=hidden])", "object[usemap]", "video[controls]" ]
            },
            "sectioning roots": {
                elements: [ "blockquote", "body", "details", "dialog", "fieldset", "figure", "td" ]
            },
            "form-associated": {
                elements: [ "button", "fieldset", "input", "keygen", "label", "object", "output", "select", "textarea" ]
            },
            listed: {
                elements: [ "button", "fieldset", "input", "keygen", "object", "output", "select", "textarea" ]
            },
            submittable: {
                elements: [ "button", "input", "keygen", "object", "select", "textarea" ]
            },
            resettable: {
                elements: [ "input", "keygen", "output", "select", "textarea" ]
            },
            labelable: {
                elements: [ "button", "input", "keygen", "meter", "output", "progress", "select", "textarea" ]
            },
            palpable: {
                elements: [ "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "button", "canvas", "cite", "code", "data", "details", "dfn", "div", "em", "embed", "fieldset", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "i", "iframe", "img", "ins", "kbd", "keygen", "label", "map", "mark", "math", "meter", "nav", "object", "output", "p", "pre", "progress", "q", "ruby", "s", "samp", "section", "select", "small", "span", "strong", "sub", "sup", "svg", "table", "textarea", "time", "u", "var", "video" ],
                exceptions: [ "audio", "dl", "input", "menu", "ol", "ul" ],
                exceptionsSelectors: [ "audio[controls]", "dl", "input:not([type=hidden])", "menu[type=toolbar]", "ol", "ul" ]
            }
        }, j = [ "accesskey", "class", "contenteditable", "contextmenu", "dir", "draggable", "dropzone", "hidden", "id", "inert", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "spellcheck", "style", "tabindex", "title", "translate", "role", /aria-[a-z\-]+/, /data-[a-z\-]+/, /on[a-z\-]+/ ], k = [ "applet", "acronym", "bgsound", "dir", "frame", "frameset", "noframes", "hgroup", "isindex", "listing", "nextid", "noembed", "plaintext", "rb", "strike", "xmp", "basefont", "big", "blink", "center", "font", "marquee", "multicol", "nobr", "spacer", "tt" ], l = [ {
            attribute: "charset",
            elements: "a"
        }, {
            attribute: "charset",
            elements: "link"
        }, {
            attribute: "coords",
            elements: "a"
        }, {
            attribute: "shape",
            elements: "a"
        }, {
            attribute: "methods",
            elements: "a"
        }, {
            attribute: "methods",
            elements: "link"
        }, {
            attribute: "name",
            elements: "a"
        }, {
            attribute: "name",
            elements: "embed"
        }, {
            attribute: "name",
            elements: "img"
        }, {
            attribute: "name",
            elements: "option"
        }, {
            attribute: "rev",
            elements: "a"
        }, {
            attribute: "rev",
            elements: "link"
        }, {
            attribute: "urn",
            elements: "a"
        }, {
            attribute: "urn",
            elements: "link"
        }, {
            attribute: "accept",
            elements: "form"
        }, {
            attribute: "nohref",
            elements: "area"
        }, {
            attribute: "profile",
            elements: "head"
        }, {
            attribute: "version",
            elements: "html"
        }, {
            attribute: "ismap",
            elements: "input"
        }, {
            attribute: "usemap",
            elements: "input"
        }, {
            attribute: "longdesc",
            elements: "iframe"
        }, {
            attribute: "longdesc",
            elements: "img"
        }, {
            attribute: "lowsrc",
            elements: "img"
        }, {
            attribute: "target",
            elements: "link"
        }, {
            attribute: "scheme",
            elements: "meta"
        }, {
            attribute: "archive",
            elements: "object"
        }, {
            attribute: "classid",
            elements: "object"
        }, {
            attribute: "code",
            elements: "object"
        }, {
            attribute: "codebase",
            elements: "object"
        }, {
            attribute: "codetype",
            elements: "object"
        }, {
            attribute: "declare",
            elements: "object"
        }, {
            attribute: "standby",
            elements: "object"
        }, {
            attribute: "type",
            elements: "param"
        }, {
            attribute: "valuetype",
            elements: "param"
        }, {
            attribute: "language",
            elements: "script"
        }, {
            attribute: "event",
            elements: "script"
        }, {
            attribute: "for",
            elements: "script"
        }, {
            attribute: "datapagesize",
            elements: "table"
        }, {
            attribute: "summary",
            elements: "table"
        }, {
            attribute: "axis",
            elements: "td; th"
        }, {
            attribute: "scope",
            elements: "td"
        }, {
            attribute: "datasrc",
            elements: "a; applet; button; div; frame; iframe; img; input; label; legend; marquee; object; option; select; span; table; textarea"
        }, {
            attribute: "datafld",
            elements: "a; applet; button; div; fieldset; frame; iframe; img; input; label; legend; marquee; object; param; select; span; textarea"
        }, {
            attribute: "dataformatas",
            elements: "button; div; input; label; legend; marquee; object; option; select; span; table"
        }, {
            attribute: "alink",
            elements: "body"
        }, {
            attribute: "bgcolor",
            elements: "body"
        }, {
            attribute: "link",
            elements: "body"
        }, {
            attribute: "marginbottom",
            elements: "body"
        }, {
            attribute: "marginheight",
            elements: "body"
        }, {
            attribute: "marginleft",
            elements: "body"
        }, {
            attribute: "marginright",
            elements: "body"
        }, {
            attribute: "margintop",
            elements: "body"
        }, {
            attribute: "marginwidth",
            elements: "body"
        }, {
            attribute: "text",
            elements: "body"
        }, {
            attribute: "vlink",
            elements: "body"
        }, {
            attribute: "clear",
            elements: "br"
        }, {
            attribute: "align",
            elements: "caption"
        }, {
            attribute: "align",
            elements: "col"
        }, {
            attribute: "char",
            elements: "col"
        }, {
            attribute: "charoff",
            elements: "col"
        }, {
            attribute: "valign",
            elements: "col"
        }, {
            attribute: "width",
            elements: "col"
        }, {
            attribute: "align",
            elements: "div"
        }, {
            attribute: "compact",
            elements: "dl"
        }, {
            attribute: "align",
            elements: "embed"
        }, {
            attribute: "hspace",
            elements: "embed"
        }, {
            attribute: "vspace",
            elements: "embed"
        }, {
            attribute: "align",
            elements: "hr"
        }, {
            attribute: "color",
            elements: "hr"
        }, {
            attribute: "noshade",
            elements: "hr"
        }, {
            attribute: "size",
            elements: "hr"
        }, {
            attribute: "width",
            elements: "hr"
        }, {
            attribute: "align",
            elements: "h1; h2; h3; h4; h5; h6"
        }, {
            attribute: "align",
            elements: "iframe"
        }, {
            attribute: "allowtransparency",
            elements: "iframe"
        }, {
            attribute: "frameborder",
            elements: "iframe"
        }, {
            attribute: "hspace",
            elements: "iframe"
        }, {
            attribute: "marginheight",
            elements: "iframe"
        }, {
            attribute: "marginwidth",
            elements: "iframe"
        }, {
            attribute: "scrolling",
            elements: "iframe"
        }, {
            attribute: "vspace",
            elements: "iframe"
        }, {
            attribute: "align",
            elements: "input"
        }, {
            attribute: "hspace",
            elements: "input"
        }, {
            attribute: "vspace",
            elements: "input"
        }, {
            attribute: "align",
            elements: "img"
        }, {
            attribute: "border",
            elements: "img"
        }, {
            attribute: "hspace",
            elements: "img"
        }, {
            attribute: "vspace",
            elements: "img"
        }, {
            attribute: "align",
            elements: "legend"
        }, {
            attribute: "type",
            elements: "li"
        }, {
            attribute: "compact",
            elements: "menu"
        }, {
            attribute: "align",
            elements: "object"
        }, {
            attribute: "border",
            elements: "object"
        }, {
            attribute: "hspace",
            elements: "object"
        }, {
            attribute: "vspace",
            elements: "object"
        }, {
            attribute: "compact",
            elements: "ol"
        }, {
            attribute: "align",
            elements: "p"
        }, {
            attribute: "width",
            elements: "pre"
        }, {
            attribute: "align",
            elements: "table"
        }, {
            attribute: "bgcolor",
            elements: "table"
        }, {
            attribute: "cellpadding",
            elements: "table"
        }, {
            attribute: "cellspacing",
            elements: "table"
        }, {
            attribute: "frame",
            elements: "table"
        }, {
            attribute: "rules",
            elements: "table"
        }, {
            attribute: "width",
            elements: "table"
        }, {
            attribute: "align",
            elements: "tbody; thead; tfoot"
        }, {
            attribute: "char",
            elements: "tbody; thead; tfoot"
        }, {
            attribute: "charoff",
            elements: "tbody; thead; tfoot"
        }, {
            attribute: "valign",
            elements: "tbody; thead; tfoot"
        }, {
            attribute: "align",
            elements: "td; th"
        }, {
            attribute: "bgcolor",
            elements: "td; th"
        }, {
            attribute: "char",
            elements: "td; th"
        }, {
            attribute: "charoff",
            elements: "td; th"
        }, {
            attribute: "height",
            elements: "td; th"
        }, {
            attribute: "nowrap",
            elements: "td; th"
        }, {
            attribute: "valign",
            elements: "td; th"
        }, {
            attribute: "width",
            elements: "td; th"
        }, {
            attribute: "align",
            elements: "tr"
        }, {
            attribute: "bgcolor",
            elements: "tr"
        }, {
            attribute: "char",
            elements: "tr"
        }, {
            attribute: "charoff",
            elements: "tr"
        }, {
            attribute: "valign",
            elements: "tr"
        }, {
            attribute: "compact",
            elements: "ul"
        }, {
            attribute: "type",
            elements: "ul"
        }, {
            attribute: "background",
            elements: "body; table; thead; tbody; tfoot; tr; td; th"
        } ], m = [ {
            attributes: [ "alt" ],
            element: "area"
        }, {
            attributes: [ "height", "width" ],
            element: "applet"
        }, {
            attributes: [ "dir" ],
            element: "bdo"
        }, {
            attributes: [ "action" ],
            element: "form"
        }, {
            attributes: [ "alt", "src" ],
            element: "img"
        }, {
            attributes: [ "name" ],
            element: "map"
        }, {
            attributes: [ "label" ],
            element: "optgroup"
        }, {
            attributes: [ "name" ],
            element: "param"
        }, {
            attributes: [ "cols", "rows" ],
            element: "textarea"
        } ], n = Object.keys(h).sort(), o = {
            isElementValid: function(a) {
                return n.indexOf(a) >= 0;
            },
            isElementObsolete: function(a) {
                return k.indexOf(a) >= 0;
            },
            isAttributeValidForElement: function(a, b) {
                return e(a) ? !0 : d(b).indexOf("any") >= 0 ? !0 : d(b).indexOf(a) >= 0;
            },
            isAttributeObsoleteForElement: function(a, b) {
                return l.some(function(c) {
                    return c.attribute !== a ? !1 : c.elements.split(/\s*;\s*/).some(function(a) {
                        return a === b;
                    });
                });
            },
            isAttributeRequiredForElement: function(a, b) {
                return m.some(function(c) {
                    return b == c.element && c.attributes.indexOf(a) >= 0;
                });
            },
            getRequiredAttributesForElement: function(a) {
                var b = m.filter(function(b) {
                    return b.element == a;
                });
                return b[0] && b[0].attributes || [];
            },
            isChildAllowedInParent: function(a, b) {
                return h[a] && h[b] ? g(a, f(b)) : !0;
            }
        };
        b.exports = {
            name: "validation",
            module: o
        };
    }, {
        "../utils/string-matcher": 38
    } ],
    25: [ function(a, b, c) {
        function d() {
            this._errors = [];
        }
        d.prototype.warn = function(a, b, c) {
            this._errors.push({
                rule: a,
                message: b,
                context: c
            });
        }, d.prototype.getWarnings = function() {
            return this._errors;
        }, b.exports = d;
    }, {} ],
    26: [ function(a, b, c) {
        function d() {}
        var e = a("mout/object/mixIn");
        d.prototype.add = function(a, b, c) {
            "string" == typeof a ? ("function" == typeof b && (c = b, b = {}), this[a] = {
                name: a,
                config: b,
                func: c
            }) : this[a.name] = {
                name: a.name,
                config: a.config,
                func: a.func
            };
        }, d.prototype.extend = function(a, b) {
            "function" == typeof b && (b = b.call(this[a].config, this[a].config)), e(this[a].config, b);
        }, b.exports = d;
    }, {
        "mout/object/mixIn": 18
    } ],
    27: [ function(a, b, c) {
        var d = a("../../utils/string-matcher");
        b.exports = {
            name: "inline-event-handlers",
            config: {
                whitelist: []
            },
            func: function(a, b, c) {
                a.on("attribute", function(a, e) {
                    0 !== a.indexOf("on") || d(a, c.whitelist) || b.warn("inline-event-handlers", "An '" + a + "' attribute was found in the HTML. Use external scripts for event binding instead.", this);
                });
            }
        };
    }, {
        "../../utils/string-matcher": 38
    } ],
    28: [ function(a, b, c) {
        b.exports = {
            name: "script-placement",
            config: {
                whitelist: []
            },
            func: function(b, c, d) {
                function e(a) {
                    return g ? "string" == typeof g ? h(a, g) : Array.isArray(g) ? g.length && g.some(function(b) {
                        return h(a, b);
                    }) : !1 : !1;
                }
                var f = [], g = d.whitelist, h = a("dom-utils/src/matches");
                b.on("element", function(a) {
                    f.push(this);
                }), b.on("afterInspect", function() {
                    for (var a; (a = f.pop()) && "script" == a.nodeName.toLowerCase(); ) ;
                    f.forEach(function(a) {
                        if ("script" == a.nodeName.toLowerCase()) {
                            if (a.async === !0 || a.defer === !0) return;
                            e(a) || c.warn("script-placement", "<script> elements should appear right before the closing </body> tag for optimal performance.", a);
                        }
                    });
                });
            }
        };
    }, {
        "dom-utils/src/matches": 2
    } ],
    29: [ function(a, b, c) {
        b.exports = {
            name: "unnecessary-elements",
            config: {
                isUnnecessary: function(a) {
                    var b = a.nodeName.toLowerCase(), c = "div" == b || "span" == b, d = 0 === a.attributes.length;
                    return c && d;
                }
            },
            func: function(a, b, c) {
                a.on("element", function(a) {
                    c.isUnnecessary(this) && b.warn("unnecessary-elements", "Do not use <div> or <span> elements without any attributes.", this);
                });
            }
        };
    }, {} ],
    30: [ function(a, b, c) {
        b.exports = {
            name: "unused-classes",
            config: {
                whitelist: [ /^js\-/, /^supports\-/, /^language\-/, /^lang\-/ ]
            },
            func: function(b, c, d) {
                var e = this.modules.css.getClassSelectors(), f = a("../../utils/string-matcher");
                b.on("class", function(a) {
                    !f(a, d.whitelist) && e.indexOf(a) < 0 && c.warn("unused-classes", "The class '" + a + "' is used in the HTML but not found in any stylesheet.", this);
                });
            }
        };
    }, {
        "../../utils/string-matcher": 38
    } ],
    31: [ function(a, b, c) {
        function d() {
            return "string" == typeof f.methodology ? e[f.methodology] : f.methodology;
        }
        var e = {
            suit: {
                modifier: /^([A-Z][a-zA-Z]*(?:\-[a-zA-Z]+)?)\-\-[a-zA-Z]+$/,
                element: /^([A-Z][a-zA-Z]*)\-[a-zA-Z]+$/
            },
            inuit: {
                modifier: /^((?:[a-z]+\-)*[a-z]+(?:__(?:[a-z]+\-)*[a-z]+)?)\-\-(?:[a-z]+\-)*[a-z]+$/,
                element: /^((?:[a-z]+\-)*[a-z]+)__(?:[a-z]+\-)*[a-z]+$/
            },
            yandex: {
                modifier: /^((?:[a-z]+\-)*[a-z]+(?:__(?:[a-z]+\-)*[a-z]+)?)_(?:[a-z]+_)*[a-z]+$/,
                element: /^((?:[a-z]+\-)*[a-z]+)__(?:[a-z]+\-)*[a-z]+$/
            }
        }, f = {
            methodology: "suit",
            getBlockName: function(a) {
                var b, c = d();
                return c.modifier.test(a) ? b = RegExp.$1 : c.element.test(a) ? b = RegExp.$1 : b || !1;
            },
            isElement: function(a) {
                return d().element.test(a);
            },
            isModifier: function(a) {
                return d().modifier.test(a);
            }
        };
        b.exports = {
            name: "bem-conventions",
            config: f,
            func: function(b, c, d) {
                var e = a("dom-utils/src/parents"), f = a("dom-utils/src/matches");
                b.on("class", function(a) {
                    if (d.isElement(a)) {
                        var b = e(this).some(function(b) {
                            return f(b, "." + d.getBlockName(a));
                        });
                        b || c.warn("bem-conventions", "The BEM element '" + a + "' must be a descendent of '" + d.getBlockName(a) + "'.", this);
                    }
                    d.isModifier(a) && (f(this, "." + d.getBlockName(a)) || c.warn("bem-conventions", "The BEM modifier class '" + a + "' was found without the unmodified class '" + d.getBlockName(a) + "'.", this));
                });
            }
        };
    }, {
        "dom-utils/src/matches": 2,
        "dom-utils/src/parents": 3
    } ],
    32: [ function(a, b, c) {
        var d = a("../../utils/string-matcher");
        b.exports = {
            name: "duplicate-ids",
            config: {
                whitelist: []
            },
            func: function(a, b, c) {
                var e = [];
                a.on("id", function(a) {
                    d(a, c.whitelist) || e.push({
                        id: a,
                        context: this
                    });
                }), a.on("afterInspect", function() {
                    for (var a, c, d = []; a = e.shift(); ) d = e.filter(function(b) {
                        return a.id === b.id;
                    }), e = e.filter(function(b) {
                        return a.id !== b.id;
                    }), d.length && (c = [ a.context ].concat(d.map(function(a) {
                        return a.context;
                    })), b.warn("duplicate-ids", "The id '" + a.id + "' appears more than once in the document.", c));
                });
            }
        };
    }, {
        "../../utils/string-matcher": 38
    } ],
    33: [ function(a, b, c) {
        b.exports = {
            name: "unique-elements",
            config: {
                elements: [ "title", "main" ]
            },
            func: function(a, b, c) {
                var d = {}, e = c.elements;
                e.forEach(function(a) {
                    d[a] = [];
                }), a.on("element", function(a) {
                    e.indexOf(a) >= 0 && d[a].push(this);
                }), a.on("afterInspect", function() {
                    e.forEach(function(a) {
                        d[a].length > 1 && b.warn("unique-elements", "The <" + a + "> element may only appear once in the document.", d[a]);
                    });
                });
            }
        };
    }, {} ],
    34: [ function(a, b, c) {
        var d = a("../../utils/string-matcher");
        b.exports = {
            name: "validate-attributes",
            config: {
                whitelist: [ /ng\-[a-z\-]+/ ]
            },
            func: function(a, b, c) {
                var e = this.modules.validation;
                a.on("element", function(a) {
                    var f = e.getRequiredAttributesForElement(a);
                    f.forEach(function(e) {
                        d(e, c.whitelist) || this.hasAttribute(e) || b.warn("validate-attributes", "The '" + e + "' attribute is required for <" + a + "> elements.", this);
                    }, this);
                }), a.on("attribute", function(a) {
                    var f = this.nodeName.toLowerCase();
                    e.isElementValid(f) && (d(a, c.whitelist) || (e.isAttributeObsoleteForElement(a, f) ? b.warn("validate-attributes", "The '" + a + "' attribute is no longer valid on the <" + f + "> element and should not be used.", this) : e.isAttributeValidForElement(a, f) || b.warn("validate-attributes", "'" + a + "' is not a valid attribute of the <" + f + "> element.", this)));
                });
            }
        };
    }, {
        "../../utils/string-matcher": 38
    } ],
    35: [ function(a, b, c) {
        b.exports = {
            name: "validate-element-location",
            config: {
                whitelist: []
            },
            func: function(b, c, d) {
                function e(a) {
                    var b = a, d = this.parentNode.nodeName.toLowerCase();
                    h.isChildAllowedInParent(b, d) || (j.push(this), c.warn("validate-element-location", "The <" + b + "> element cannot be a child of the <" + d + "> element.", this));
                }
                function f(a) {
                    i(this, "body style:not([scoped])") ? c.warn("validate-element-location", "<style> elements inside <body> must contain the 'scoped' attribute.", this) : i(this, "body style[scoped]:not(:first-child)") && c.warn("validate-element-location", "Scoped <style> elements must be the first child of their parent element.", this);
                }
                function g(a) {
                    i(this, "body meta:not([itemprop]), body link:not([itemprop])") && c.warn("validate-element-location", "<" + a + "> elements inside <body> must contain the 'itemprop' attribute.", this);
                }
                var h = this.modules.validation, i = a("dom-utils/src/matches"), j = (a("dom-utils/src/parents"), 
                []);
                b.on("element", function(a) {
                    i(this, d.whitelist) || this.parentNode && 1 == this.parentNode.nodeType && (j.indexOf(this) > -1 || (e.call(this, a), 
                    f.call(this, a), g.call(this, a)));
                });
            }
        };
    }, {
        "dom-utils/src/matches": 2,
        "dom-utils/src/parents": 3
    } ],
    36: [ function(a, b, c) {
        var d = a("../../utils/string-matcher");
        b.exports = {
            name: "validate-elements",
            config: {
                whitelist: []
            },
            func: function(a, b, c) {
                var e = this.modules.validation;
                a.on("element", function(a) {
                    d(a, c.whitelist) || (e.isElementObsolete(a) ? b.warn("validate-elements", "The <" + a + "> element is obsolete and should not be used.", this) : e.isElementValid(a) || b.warn("validate-elements", "The <" + a + "> element is not a valid HTML element.", this));
                });
            }
        };
    }, {
        "../../utils/string-matcher": 38
    } ],
    37: [ function(a, b, c) {
        var d = document.createElement("a");
        b.exports = function(a) {
            return d.href = a, !(d.protocol == location.protocol && d.host == location.host);
        };
    }, {} ],
    38: [ function(a, b, c) {
        function d(a, b) {
            return e(b) ? b.test(a) : "string" == typeof b ? a == b : b.some(function(b) {
                return e(b) ? b.test(a) : a === b;
            });
        }
        var e = a("mout/lang/isRegExp");
        b.exports = d;
    }, {
        "mout/lang/isRegExp": 11
    } ]
}, {}, [ 20 ]), jQuery(document).ready(function() {
    jQuery(".pop-cover").length && (jQuery(".pop-cover").hide(), jQuery(document).on("click", ".pop", function() {
        popcont = this.rel, jQuery(".pop-cover").fadeIn(), jQuery(".pop-up").hide(), jQuery("." + popcont).show();
    }), jQuery(".pop-up").on("click", ".close", function() {
        jQuery(".pop-cover").fadeOut();
    })), jQuery(".tabs").on("click", "li", function() {
        var a = jQuery(this).data("target");
        jQuery(this).addClass("active").siblings().removeClass("active"), jQuery("." + a).show().siblings().hide();
    }), jQuery(".accordion").on("click", "li", function() {
        jQuery(this).siblings().removeClass("active").end().addClass("active");
    });
});

var countImages = $(".mainwrap img").size();

$(".mainwrap").imagesLoaded().always(function(a) {
    $(".page-landing").length && setTimeout(function() {
        $("html, body").animate({
            scrollTop: 180
        }, 800);
    }, 800), $("body").removeClass("stop-scrolling"), $("#loader-wrapper").addClass("loaded"), 
    $(".caramelImgHolder").addClass("animated bounceInLeft").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
        $(".caramel-header, .chocolate-header").addClass("animated fadeInUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            $(".caramel-txt1").addClass("animated bounceIn"), $(".caramel-txt2").addClass("animated bounceIn"), 
            $(".caramel-txt3").addClass("animated bounceIn"), $(".caramel-txt4").addClass("animated bounceIn"), 
            $(".chocolate-txt1").addClass("animated bounceIn"), $(".chocolate-txt2").addClass("animated bounceIn"), 
            $(".chocolate-txt3").addClass("animated bounceIn"), $(".chocolate-txt4").addClass("animated bounceIn"), 
            $(".caramel-bean1").addClass("animated bounceIn"), $(".caramel-bean2").addClass("animated bounceIn"), 
            $(".caramel-bean3").addClass("animated bounceIn"), $(".choco-bean1").addClass("animated bounceIn"), 
            $(".choco-bean2").addClass("animated bounceIn"), $(".choco-bean3").addClass("animated bounceIn");
        });
    }), $(".chocoImgHolder").addClass("animated bounceInRight"), $(".graph-luzon").addClass("animated fadeInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
        $(".graph-visayas").addClass("animated fadeInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            $(".graph-mindanao").addClass("animated fadeInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                $(".landingPage .buttonWrap").addClass("animated fadeInUp"), $(".countdownWrap").addClass("animated fadeInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    $(".luzonCaramelVotes, .visayasCaramelVotes, .mindanaoCaramelVotes, .luzonChocoVotes, .visayasChocoVotes, .mindanaoChocoVotes, .luzonCaramelPercentBar, .visayasCaramelPercentBar, .mindanaoCaramelPercentBar").addClass("removedelay"), 
                    $(".caramel-header, .chocolate-header").removeClass("fadeInUp").addClass("pause");
                });
            });
        });
    }), $(".whichTeam").addClass("animated fadeIn"), $(".vs").addClass("animated bounceIn"), 
    $(".titleanimate").addClass("animated fadeInDown"), $(".vote-chocolate, .vote-caramel").addClass("animated bounceIn").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
        $(".chocolate-header, .caramel-header").addClass("animated fadeInUp"), $(".caramel-txt1").addClass("animated bounceIn"), 
        $(".caramel-txt2").addClass("animated bounceIn"), $(".caramel-txt3").addClass("animated bounceIn"), 
        $(".caramel-txt4").addClass("animated bounceIn"), $(".chocolate-txt1").addClass("animated bounceIn"), 
        $(".chocolate-txt2").addClass("animated bounceIn"), $(".chocolate-txt3").addClass("animated bounceIn"), 
        $(".chocolate-txt4").addClass("animated bounceIn");
    });
}).progress(function(a, b) {
    if (b.isLoaded) {
        $(b.img).addClass("loaded");
        var c = $(".mainwrap img.loaded").size(), d = 100 * (c / countImages) + "%";
        $("#progress-bar > #progress").css({
            width: d
        }), $("#progress-bar > p > span").html(d);
    }
}), !function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document) throw new Error("jQuery requires a window with a document");
        return b(a);
    } : b(a);
}("undefined" != typeof window ? window : this, function(a, b) {
    function c(a) {
        var b = !!a && "length" in a && a.length, c = na.type(a);
        return "function" === c || na.isWindow(a) ? !1 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a;
    }
    function d(a, b, c) {
        if (na.isFunction(b)) return na.grep(a, function(a, d) {
            return !!b.call(a, d, a) !== c;
        });
        if (b.nodeType) return na.grep(a, function(a) {
            return a === b !== c;
        });
        if ("string" == typeof b) {
            if (xa.test(b)) return na.filter(b, a, c);
            b = na.filter(b, a);
        }
        return na.grep(a, function(a) {
            return na.inArray(a, b) > -1 !== c;
        });
    }
    function e(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a;
    }
    function f(a) {
        var b = {};
        return na.each(a.match(Da) || [], function(a, c) {
            b[c] = !0;
        }), b;
    }
    function g() {
        da.addEventListener ? (da.removeEventListener("DOMContentLoaded", h), a.removeEventListener("load", h)) : (da.detachEvent("onreadystatechange", h), 
        a.detachEvent("onload", h));
    }
    function h() {
        (da.addEventListener || "load" === a.event.type || "complete" === da.readyState) && (g(), 
        na.ready());
    }
    function i(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(Ia, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : Ha.test(c) ? na.parseJSON(c) : c;
                } catch (e) {}
                na.data(a, b, c);
            } else c = void 0;
        }
        return c;
    }
    function j(a) {
        var b;
        for (b in a) if (("data" !== b || !na.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
        return !0;
    }
    function k(a, b, c, d) {
        if (Ga(a)) {
            var e, f, g = na.expando, h = a.nodeType, i = h ? na.cache : a, j = h ? a[g] : a[g] && g;
            if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b) return j || (j = h ? a[g] = ca.pop() || na.guid++ : g), 
            i[j] || (i[j] = h ? {} : {
                toJSON: na.noop
            }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = na.extend(i[j], b) : i[j].data = na.extend(i[j].data, b)), 
            f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[na.camelCase(b)] = c), 
            "string" == typeof b ? (e = f[b], null == e && (e = f[na.camelCase(b)])) : e = f, 
            e;
        }
    }
    function l(a, b, c) {
        if (Ga(a)) {
            var d, e, f = a.nodeType, g = f ? na.cache : a, h = f ? a[na.expando] : na.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    na.isArray(b) ? b = b.concat(na.map(b, na.camelCase)) : b in d ? b = [ b ] : (b = na.camelCase(b), 
                    b = b in d ? [ b ] : b.split(" ")), e = b.length;
                    for (;e--; ) delete d[b[e]];
                    if (c ? !j(d) : !na.isEmptyObject(d)) return;
                }
                (c || (delete g[h].data, j(g[h]))) && (f ? na.cleanData([ a ], !0) : la.deleteExpando || g != g.window ? delete g[h] : g[h] = void 0);
            }
        }
    }
    function m(a, b, c, d) {
        var e, f = 1, g = 20, h = d ? function() {
            return d.cur();
        } : function() {
            return na.css(a, b, "");
        }, i = h(), j = c && c[3] || (na.cssNumber[b] ? "" : "px"), k = (na.cssNumber[b] || "px" !== j && +i) && Ka.exec(na.css(a, b));
        if (k && k[3] !== j) {
            j = j || k[3], c = c || [], k = +i || 1;
            do f = f || ".5", k /= f, na.style(a, b, k + j); while (f !== (f = h() / i) && 1 !== f && --g);
        }
        return c && (k = +k || +i || 0, e = c[1] ? k + (c[1] + 1) * c[2] : +c[2], d && (d.unit = j, 
        d.start = k, d.end = e)), e;
    }
    function n(a) {
        var b = Sa.split("|"), c = a.createDocumentFragment();
        if (c.createElement) for (;b.length; ) c.createElement(b.pop());
        return c;
    }
    function o(a, b) {
        var c, d, e = 0, f = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : void 0;
        if (!f) for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || na.nodeName(d, b) ? f.push(d) : na.merge(f, o(d, b));
        return void 0 === b || b && na.nodeName(a, b) ? na.merge([ a ], f) : f;
    }
    function p(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++) na._data(c, "globalEval", !b || na._data(b[d], "globalEval"));
    }
    function q(a) {
        Oa.test(a.type) && (a.defaultChecked = a.checked);
    }
    function r(a, b, c, d, e) {
        for (var f, g, h, i, j, k, l, m = a.length, r = n(b), s = [], t = 0; m > t; t++) if (g = a[t], 
        g || 0 === g) if ("object" === na.type(g)) na.merge(s, g.nodeType ? [ g ] : g); else if (Ua.test(g)) {
            for (i = i || r.appendChild(b.createElement("div")), j = (Pa.exec(g) || [ "", "" ])[1].toLowerCase(), 
            l = Ta[j] || Ta._default, i.innerHTML = l[1] + na.htmlPrefilter(g) + l[2], f = l[0]; f--; ) i = i.lastChild;
            if (!la.leadingWhitespace && Ra.test(g) && s.push(b.createTextNode(Ra.exec(g)[0])), 
            !la.tbody) for (g = "table" !== j || Va.test(g) ? "<table>" !== l[1] || Va.test(g) ? 0 : i : i.firstChild, 
            f = g && g.childNodes.length; f--; ) na.nodeName(k = g.childNodes[f], "tbody") && !k.childNodes.length && g.removeChild(k);
            for (na.merge(s, i.childNodes), i.textContent = ""; i.firstChild; ) i.removeChild(i.firstChild);
            i = r.lastChild;
        } else s.push(b.createTextNode(g));
        for (i && r.removeChild(i), la.appendChecked || na.grep(o(s, "input"), q), t = 0; g = s[t++]; ) if (d && na.inArray(g, d) > -1) e && e.push(g); else if (h = na.contains(g.ownerDocument, g), 
        i = o(r.appendChild(g), "script"), h && p(i), c) for (f = 0; g = i[f++]; ) Qa.test(g.type || "") && c.push(g);
        return i = null, r;
    }
    function s() {
        return !0;
    }
    function t() {
        return !1;
    }
    function u() {
        try {
            return da.activeElement;
        } catch (a) {}
    }
    function v(a, b, c, d, e, f) {
        var g, h;
        if ("object" == typeof b) {
            "string" != typeof c && (d = d || c, c = void 0);
            for (h in b) v(a, h, c, d, b[h], f);
            return a;
        }
        if (null == d && null == e ? (e = c, d = c = void 0) : null == e && ("string" == typeof c ? (e = d, 
        d = void 0) : (e = d, d = c, c = void 0)), e === !1) e = t; else if (!e) return a;
        return 1 === f && (g = e, e = function(a) {
            return na().off(a), g.apply(this, arguments);
        }, e.guid = g.guid || (g.guid = na.guid++)), a.each(function() {
            na.event.add(this, b, e, d, c);
        });
    }
    function w(a, b) {
        return na.nodeName(a, "table") && na.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
    }
    function x(a) {
        return a.type = (null !== na.find.attr(a, "type")) + "/" + a.type, a;
    }
    function y(a) {
        var b = eb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a;
    }
    function z(a, b) {
        if (1 === b.nodeType && na.hasData(a)) {
            var c, d, e, f = na._data(a), g = na._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h) for (d = 0, e = h[c].length; e > d; d++) na.event.add(b, c, h[c][d]);
            }
            g.data && (g.data = na.extend({}, g.data));
        }
    }
    function A(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !la.noCloneEvent && b[na.expando]) {
                e = na._data(b);
                for (d in e.events) na.removeEvent(b, d, e.handle);
                b.removeAttribute(na.expando);
            }
            "script" === c && b.text !== a.text ? (x(b).text = a.text, y(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), 
            la.html5Clone && a.innerHTML && !na.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Oa.test(a.type) ? (b.defaultChecked = b.checked = a.checked, 
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue);
        }
    }
    function B(a, b, c, d) {
        b = fa.apply([], b);
        var e, f, g, h, i, j, k = 0, l = a.length, m = l - 1, n = b[0], p = na.isFunction(n);
        if (p || l > 1 && "string" == typeof n && !la.checkClone && db.test(n)) return a.each(function(e) {
            var f = a.eq(e);
            p && (b[0] = n.call(this, e, f.html())), B(f, b, c, d);
        });
        if (l && (j = r(b, a[0].ownerDocument, !1, a, d), e = j.firstChild, 1 === j.childNodes.length && (j = e), 
        e || d)) {
            for (h = na.map(o(j, "script"), x), g = h.length; l > k; k++) f = j, k !== m && (f = na.clone(f, !0, !0), 
            g && na.merge(h, o(f, "script"))), c.call(a[k], f, k);
            if (g) for (i = h[h.length - 1].ownerDocument, na.map(h, y), k = 0; g > k; k++) f = h[k], 
            Qa.test(f.type || "") && !na._data(f, "globalEval") && na.contains(i, f) && (f.src ? na._evalUrl && na._evalUrl(f.src) : na.globalEval((f.text || f.textContent || f.innerHTML || "").replace(fb, "")));
            j = e = null;
        }
        return a;
    }
    function C(a, b, c) {
        for (var d, e = b ? na.filter(b, a) : a, f = 0; null != (d = e[f]); f++) c || 1 !== d.nodeType || na.cleanData(o(d)), 
        d.parentNode && (c && na.contains(d.ownerDocument, d) && p(o(d, "script")), d.parentNode.removeChild(d));
        return a;
    }
    function D(a, b) {
        var c = na(b.createElement(a)).appendTo(b.body), d = na.css(c[0], "display");
        return c.detach(), d;
    }
    function E(a) {
        var b = da, c = jb[a];
        return c || (c = D(a, b), "none" !== c && c || (ib = (ib || na("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), 
        b = (ib[0].contentWindow || ib[0].contentDocument).document, b.write(), b.close(), 
        c = D(a, b), ib.detach()), jb[a] = c), c;
    }
    function F(a, b) {
        return {
            get: function() {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments);
            }
        };
    }
    function G(a) {
        if (a in yb) return a;
        for (var b = a.charAt(0).toUpperCase() + a.slice(1), c = xb.length; c--; ) if (a = xb[c] + b, 
        a in yb) return a;
    }
    function H(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = na._data(d, "olddisplay"), 
        c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Ma(d) && (f[g] = na._data(d, "olddisplay", E(d.nodeName)))) : (e = Ma(d), 
        (c && "none" !== c || !e) && na._data(d, "olddisplay", e ? c : na.css(d, "display"))));
        for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a;
    }
    function I(a, b, c) {
        var d = ub.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
    }
    function J(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += na.css(a, c + La[f], !0, e)), 
        d ? ("content" === c && (g -= na.css(a, "padding" + La[f], !0, e)), "margin" !== c && (g -= na.css(a, "border" + La[f] + "Width", !0, e))) : (g += na.css(a, "padding" + La[f], !0, e), 
        "padding" !== c && (g += na.css(a, "border" + La[f] + "Width", !0, e)));
        return g;
    }
    function K(b, c, d) {
        var e = !0, f = "width" === c ? b.offsetWidth : b.offsetHeight, g = ob(b), h = la.boxSizing && "border-box" === na.css(b, "boxSizing", !1, g);
        if (da.msFullscreenElement && a.top !== a && b.getClientRects().length && (f = Math.round(100 * b.getBoundingClientRect()[c])), 
        0 >= f || null == f) {
            if (f = pb(b, c, g), (0 > f || null == f) && (f = b.style[c]), lb.test(f)) return f;
            e = h && (la.boxSizingReliable() || f === b.style[c]), f = parseFloat(f) || 0;
        }
        return f + J(b, c, d || (h ? "border" : "content"), e, g) + "px";
    }
    function L(a, b, c, d, e) {
        return new L.prototype.init(a, b, c, d, e);
    }
    function M() {
        return a.setTimeout(function() {
            zb = void 0;
        }), zb = na.now();
    }
    function N(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = La[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d;
    }
    function O(a, b, c) {
        for (var d, e = (R.tweeners[b] || []).concat(R.tweeners["*"]), f = 0, g = e.length; g > f; f++) if (d = e[f].call(c, b, a)) return d;
    }
    function P(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && Ma(a), p = na._data(a, "fxshow");
        c.queue || (h = na._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, 
        i = h.empty.fire, h.empty.fire = function() {
            h.unqueued || i();
        }), h.unqueued++, l.always(function() {
            l.always(function() {
                h.unqueued--, na.queue(a, "fx").length || h.empty.fire();
            });
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [ n.overflow, n.overflowX, n.overflowY ], 
        j = na.css(a, "display"), k = "none" === j ? na._data(a, "olddisplay") || E(a.nodeName) : j, 
        "inline" === k && "none" === na.css(a, "float") && (la.inlineBlockNeedsLayout && "inline" !== E(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), 
        c.overflow && (n.overflow = "hidden", la.shrinkWrapBlocks() || l.always(function() {
            n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2];
        }));
        for (d in b) if (e = b[d], Bb.exec(e)) {
            if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                if ("show" !== e || !p || void 0 === p[d]) continue;
                o = !0;
            }
            m[d] = p && p[d] || na.style(a, d);
        } else j = void 0;
        if (na.isEmptyObject(m)) "inline" === ("none" === j ? E(a.nodeName) : j) && (n.display = j); else {
            p ? "hidden" in p && (o = p.hidden) : p = na._data(a, "fxshow", {}), f && (p.hidden = !o), 
            o ? na(a).show() : l.done(function() {
                na(a).hide();
            }), l.done(function() {
                var b;
                na._removeData(a, "fxshow");
                for (b in m) na.style(a, b, m[b]);
            });
            for (d in m) g = O(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, 
            g.start = "width" === d || "height" === d ? 1 : 0));
        }
    }
    function Q(a, b) {
        var c, d, e, f, g;
        for (c in a) if (d = na.camelCase(c), e = b[d], f = a[c], na.isArray(f) && (e = f[1], 
        f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = na.cssHooks[d], g && "expand" in g) {
            f = g.expand(f), delete a[d];
            for (c in f) c in a || (a[c] = f[c], b[c] = e);
        } else b[d] = e;
    }
    function R(a, b, c) {
        var d, e, f = 0, g = R.prefilters.length, h = na.Deferred().always(function() {
            delete i.elem;
        }), i = function() {
            if (e) return !1;
            for (var b = zb || M(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
            return h.notifyWith(a, [ j, f, c ]), 1 > f && i ? c : (h.resolveWith(a, [ j ]), 
            !1);
        }, j = h.promise({
            elem: a,
            props: na.extend({}, b),
            opts: na.extend(!0, {
                specialEasing: {},
                easing: na.easing._default
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: zb || M(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = na.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d;
            },
            stop: function(b) {
                var c = 0, d = b ? j.tweens.length : 0;
                if (e) return this;
                for (e = !0; d > c; c++) j.tweens[c].run(1);
                return b ? (h.notifyWith(a, [ j, 1, 0 ]), h.resolveWith(a, [ j, b ])) : h.rejectWith(a, [ j, b ]), 
                this;
            }
        }), k = j.props;
        for (Q(k, j.opts.specialEasing); g > f; f++) if (d = R.prefilters[f].call(j, a, k, j.opts)) return na.isFunction(d.stop) && (na._queueHooks(j.elem, j.opts.queue).stop = na.proxy(d.stop, d)), 
        d;
        return na.map(k, O, j), na.isFunction(j.opts.start) && j.opts.start.call(a, j), 
        na.fx.timer(na.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
    }
    function S(a) {
        return na.attr(a, "class") || "";
    }
    function T(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0, f = b.toLowerCase().match(Da) || [];
            if (na.isFunction(c)) for (;d = f[e++]; ) "+" === d.charAt(0) ? (d = d.slice(1) || "*", 
            (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
        };
    }
    function U(a, b, c, d) {
        function e(h) {
            var i;
            return f[h] = !0, na.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), 
                e(j), !1);
            }), i;
        }
        var f = {}, g = a === Zb;
        return e(b.dataTypes[0]) || !f["*"] && e("*");
    }
    function V(a, b) {
        var c, d, e = na.ajaxSettings.flatOptions || {};
        for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && na.extend(!0, a, c), a;
    }
    function W(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; ) i.shift(), 
        void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e) for (g in h) if (h[g] && h[g].test(e)) {
            i.unshift(g);
            break;
        }
        if (i[0] in c) f = i[0]; else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break;
                }
                d || (d = g);
            }
            f = f || d;
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
    }
    function X(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f; ) if (a.responseFields[f] && (c[a.responseFields[f]] = b), 
        !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i; else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                break;
            }
            if (g !== !0) if (g && a["throws"]) b = g(b); else try {
                b = g(b);
            } catch (l) {
                return {
                    state: "parsererror",
                    error: g ? l : "No conversion from " + i + " to " + f
                };
            }
        }
        return {
            state: "success",
            data: b
        };
    }
    function Y(a) {
        return a.style && a.style.display || na.css(a, "display");
    }
    function Z(a) {
        for (;a && 1 === a.nodeType; ) {
            if ("none" === Y(a) || "hidden" === a.type) return !0;
            a = a.parentNode;
        }
        return !1;
    }
    function $(a, b, c, d) {
        var e;
        if (na.isArray(b)) na.each(b, function(b, e) {
            c || cc.test(a) ? d(a, e) : $(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d);
        }); else if (c || "object" !== na.type(b)) d(a, b); else for (e in b) $(a + "[" + e + "]", b[e], c, d);
    }
    function _() {
        try {
            return new a.XMLHttpRequest();
        } catch (b) {}
    }
    function aa() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP");
        } catch (b) {}
    }
    function ba(a) {
        return na.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
    }
    var ca = [], da = a.document, ea = ca.slice, fa = ca.concat, ga = ca.push, ha = ca.indexOf, ia = {}, ja = ia.toString, ka = ia.hasOwnProperty, la = {}, ma = "1.12.0", na = function(a, b) {
        return new na.fn.init(a, b);
    }, oa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, pa = /^-ms-/, qa = /-([\da-z])/gi, ra = function(a, b) {
        return b.toUpperCase();
    };
    na.fn = na.prototype = {
        jquery: ma,
        constructor: na,
        selector: "",
        length: 0,
        toArray: function() {
            return ea.call(this);
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : ea.call(this);
        },
        pushStack: function(a) {
            var b = na.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b;
        },
        each: function(a) {
            return na.each(this, a);
        },
        map: function(a) {
            return this.pushStack(na.map(this, function(b, c) {
                return a.call(b, c, b);
            }));
        },
        slice: function() {
            return this.pushStack(ea.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(a) {
            var b = this.length, c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [ this[c] ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor();
        },
        push: ga,
        sort: ca.sort,
        splice: ca.splice
    }, na.extend = na.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || na.isFunction(g) || (g = {}), 
        h === i && (g = this, h--); i > h; h++) if (null != (e = arguments[h])) for (d in e) a = g[d], 
        c = e[d], g !== c && (j && c && (na.isPlainObject(c) || (b = na.isArray(c))) ? (b ? (b = !1, 
        f = a && na.isArray(a) ? a : []) : f = a && na.isPlainObject(a) ? a : {}, g[d] = na.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g;
    }, na.extend({
        expando: "jQuery" + (ma + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a);
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === na.type(a);
        },
        isArray: Array.isArray || function(a) {
            return "array" === na.type(a);
        },
        isWindow: function(a) {
            return null != a && a == a.window;
        },
        isNumeric: function(a) {
            var b = a && a.toString();
            return !na.isArray(a) && b - parseFloat(b) + 1 >= 0;
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a) return !1;
            return !0;
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== na.type(a) || a.nodeType || na.isWindow(a)) return !1;
            try {
                if (a.constructor && !ka.call(a, "constructor") && !ka.call(a.constructor.prototype, "isPrototypeOf")) return !1;
            } catch (c) {
                return !1;
            }
            if (!la.ownFirst) for (b in a) return ka.call(a, b);
            for (b in a) ;
            return void 0 === b || ka.call(a, b);
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? ia[ja.call(a)] || "object" : typeof a;
        },
        globalEval: function(b) {
            b && na.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b);
            })(b);
        },
        camelCase: function(a) {
            return a.replace(pa, "ms-").replace(qa, ra);
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
        },
        each: function(a, b) {
            var d, e = 0;
            if (c(a)) for (d = a.length; d > e && b.call(a[e], e, a[e]) !== !1; e++) ; else for (e in a) if (b.call(a[e], e, a[e]) === !1) break;
            return a;
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(oa, "");
        },
        makeArray: function(a, b) {
            var d = b || [];
            return null != a && (c(Object(a)) ? na.merge(d, "string" == typeof a ? [ a ] : a) : ga.call(d, a)), 
            d;
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if (ha) return ha.call(b, a, c);
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++) if (c in b && b[c] === a) return c;
            }
            return -1;
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; c > d; ) a[e++] = b[d++];
            if (c !== c) for (;void 0 !== b[d]; ) a[e++] = b[d++];
            return a.length = e, a;
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
            return e;
        },
        map: function(a, b, d) {
            var e, f, g = 0, h = [];
            if (c(a)) for (e = a.length; e > g; g++) f = b(a[g], g, d), null != f && h.push(f); else for (g in a) f = b(a[g], g, d), 
            null != f && h.push(f);
            return fa.apply([], h);
        },
        guid: 1,
        proxy: function(a, b) {
            var c, d, e;
            return "string" == typeof b && (e = a[b], b = a, a = e), na.isFunction(a) ? (c = ea.call(arguments, 2), 
            d = function() {
                return a.apply(b || this, c.concat(ea.call(arguments)));
            }, d.guid = a.guid = a.guid || na.guid++, d) : void 0;
        },
        now: function() {
            return +new Date();
        },
        support: la
    }), "function" == typeof Symbol && (na.fn[Symbol.iterator] = ca[Symbol.iterator]), 
    na.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(a, b) {
        ia["[object " + b + "]"] = b.toLowerCase();
    });
    var sa = function(a) {
        function b(a, b, c, d) {
            var e, f, g, h, i, j, l, n, o = b && b.ownerDocument, p = b ? b.nodeType : 9;
            if (c = c || [], "string" != typeof a || !a || 1 !== p && 9 !== p && 11 !== p) return c;
            if (!d && ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, I)) {
                if (11 !== p && (j = ra.exec(a))) if (e = j[1]) {
                    if (9 === p) {
                        if (!(g = b.getElementById(e))) return c;
                        if (g.id === e) return c.push(g), c;
                    } else if (o && (g = o.getElementById(e)) && M(b, g) && g.id === e) return c.push(g), 
                    c;
                } else {
                    if (j[2]) return $.apply(c, b.getElementsByTagName(a)), c;
                    if ((e = j[3]) && v.getElementsByClassName && b.getElementsByClassName) return $.apply(c, b.getElementsByClassName(e)), 
                    c;
                }
                if (v.qsa && !T[a + " "] && (!J || !J.test(a))) {
                    if (1 !== p) o = b, n = a; else if ("object" !== b.nodeName.toLowerCase()) {
                        for ((h = b.getAttribute("id")) ? h = h.replace(ta, "\\$&") : b.setAttribute("id", h = N), 
                        l = z(a), f = l.length, i = ma.test(h) ? "#" + h : "[id='" + h + "']"; f--; ) l[f] = i + " " + m(l[f]);
                        n = l.join(","), o = sa.test(a) && k(b.parentNode) || b;
                    }
                    if (n) try {
                        return $.apply(c, o.querySelectorAll(n)), c;
                    } catch (q) {} finally {
                        h === N && b.removeAttribute("id");
                    }
                }
            }
            return B(a.replace(ha, "$1"), b, c, d);
        }
        function c() {
            function a(c, d) {
                return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d;
            }
            var b = [];
            return a;
        }
        function d(a) {
            return a[N] = !0, a;
        }
        function e(a) {
            var b = G.createElement("div");
            try {
                return !!a(b);
            } catch (c) {
                return !1;
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null;
            }
        }
        function f(a, b) {
            for (var c = a.split("|"), d = c.length; d--; ) w.attrHandle[c[d]] = b;
        }
        function g(a, b) {
            var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
            if (d) return d;
            if (c) for (;c = c.nextSibling; ) if (c === b) return -1;
            return a ? 1 : -1;
        }
        function h(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a;
            };
        }
        function i(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a;
            };
        }
        function j(a) {
            return d(function(b) {
                return b = +b, d(function(c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--; ) c[e = f[g]] && (c[e] = !(d[e] = c[e]));
                });
            });
        }
        function k(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a;
        }
        function l() {}
        function m(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
            return d;
        }
        function n(a, b, c) {
            var d = b.dir, e = c && "parentNode" === d, f = Q++;
            return b.first ? function(b, c, f) {
                for (;b = b[d]; ) if (1 === b.nodeType || e) return a(b, c, f);
            } : function(b, c, g) {
                var h, i, j, k = [ P, f ];
                if (g) {
                    for (;b = b[d]; ) if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
                } else for (;b = b[d]; ) if (1 === b.nodeType || e) {
                    if (j = b[N] || (b[N] = {}), i = j[b.uniqueID] || (j[b.uniqueID] = {}), (h = i[d]) && h[0] === P && h[1] === f) return k[2] = h[2];
                    if (i[d] = k, k[2] = a(b, c, g)) return !0;
                }
            };
        }
        function o(a) {
            return a.length > 1 ? function(b, c, d) {
                for (var e = a.length; e--; ) if (!a[e](b, c, d)) return !1;
                return !0;
            } : a[0];
        }
        function p(a, c, d) {
            for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
            return d;
        }
        function q(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), 
            j && b.push(h));
            return g;
        }
        function r(a, b, c, e, f, g) {
            return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, r = d || p(b || "*", h.nodeType ? [ h ] : h, []), s = !a || !d && b ? r : q(r, m, a, h, i), t = c ? f || (d ? a : o || e) ? [] : g : s;
                if (c && c(s, t, h, i), e) for (j = q(t, n), e(j, [], h, i), k = j.length; k--; ) (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                if (d) {
                    if (f || a) {
                        if (f) {
                            for (j = [], k = t.length; k--; ) (l = t[k]) && j.push(s[k] = l);
                            f(null, t = [], j, i);
                        }
                        for (k = t.length; k--; ) (l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l));
                    }
                } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t);
            });
        }
        function s(a) {
            for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                return a === b;
            }, g, !0), j = n(function(a) {
                return aa(b, a) > -1;
            }, g, !0), k = [ function(a, c, d) {
                var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                return b = null, e;
            } ]; e > h; h++) if (c = w.relative[a[h].type]) k = [ n(o(k), c) ]; else {
                if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                    for (d = ++h; e > d && !w.relative[a[d].type]; d++) ;
                    return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                        value: " " === a[h - 2].type ? "*" : ""
                    })).replace(ha, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a));
                }
                k.push(c);
            }
            return o(k);
        }
        function t(a, c) {
            var e = c.length > 0, f = a.length > 0, g = function(d, g, h, i, j) {
                var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && w.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                for (j && (C = g === G || g || j); o !== v && null != (k = t[o]); o++) {
                    if (f && k) {
                        for (l = 0, g || k.ownerDocument === G || (F(k), h = !I); m = a[l++]; ) if (m(k, g || G, h)) {
                            i.push(k);
                            break;
                        }
                        j && (P = u);
                    }
                    e && ((k = !m && k) && n--, d && p.push(k));
                }
                if (n += o, e && o !== n) {
                    for (l = 0; m = c[l++]; ) m(p, r, g, h);
                    if (d) {
                        if (n > 0) for (;o--; ) p[o] || r[o] || (r[o] = Y.call(i));
                        r = q(r);
                    }
                    $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i);
                }
                return j && (P = u, C = s), p;
            };
            return e ? d(g) : g;
        }
        var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date(), O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function(a, b) {
            return a === b && (E = !0), 0;
        }, V = 1 << 31, W = {}.hasOwnProperty, X = [], Y = X.pop, Z = X.push, $ = X.push, _ = X.slice, aa = function(a, b) {
            for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c;
            return -1;
        }, ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ca = "[\\x20\\t\\r\\n\\f]", da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ea = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + da + "))|)" + ca + "*\\]", fa = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ea + ")*)|.*)\\)|)", ga = new RegExp(ca + "+", "g"), ha = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"), ia = new RegExp("^" + ca + "*," + ca + "*"), ja = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"), ka = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"), la = new RegExp(fa), ma = new RegExp("^" + da + "$"), na = {
            ID: new RegExp("^#(" + da + ")"),
            CLASS: new RegExp("^\\.(" + da + ")"),
            TAG: new RegExp("^(" + da + "|[*])"),
            ATTR: new RegExp("^" + ea),
            PSEUDO: new RegExp("^" + fa),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + ba + ")$", "i"),
            needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
        }, oa = /^(?:input|select|textarea|button)$/i, pa = /^h\d$/i, qa = /^[^{]+\{\s*\[native \w/, ra = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, sa = /[+~]/, ta = /'|\\/g, ua = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"), va = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
        }, wa = function() {
            F();
        };
        try {
            $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType;
        } catch (xa) {
            $ = {
                apply: X.length ? function(a, b) {
                    Z.apply(a, _.call(b));
                } : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++]; ) ;
                    a.length = c - 1;
                }
            };
        }
        v = b.support = {}, y = b.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1;
        }, F = b.setDocument = function(a) {
            var b, c, d = a ? a.ownerDocument || a : O;
            return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = G.documentElement, 
            I = !y(G), (c = G.defaultView) && c.top !== c && (c.addEventListener ? c.addEventListener("unload", wa, !1) : c.attachEvent && c.attachEvent("onunload", wa)), 
            v.attributes = e(function(a) {
                return a.className = "i", !a.getAttribute("className");
            }), v.getElementsByTagName = e(function(a) {
                return a.appendChild(G.createComment("")), !a.getElementsByTagName("*").length;
            }), v.getElementsByClassName = qa.test(G.getElementsByClassName), v.getById = e(function(a) {
                return H.appendChild(a).id = N, !G.getElementsByName || !G.getElementsByName(N).length;
            }), v.getById ? (w.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && I) {
                    var c = b.getElementById(a);
                    return c ? [ c ] : [];
                }
            }, w.filter.ID = function(a) {
                var b = a.replace(ua, va);
                return function(a) {
                    return a.getAttribute("id") === b;
                };
            }) : (delete w.find.ID, w.filter.ID = function(a) {
                var b = a.replace(ua, va);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b;
                };
            }), w.find.TAG = v.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0;
            } : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (;c = f[e++]; ) 1 === c.nodeType && d.push(c);
                    return d;
                }
                return f;
            }, w.find.CLASS = v.getElementsByClassName && function(a, b) {
                return "undefined" != typeof b.getElementsByClassName && I ? b.getElementsByClassName(a) : void 0;
            }, K = [], J = [], (v.qsa = qa.test(G.querySelectorAll)) && (e(function(a) {
                H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\r\\' msallowcapture=''><option selected=''></option></select>", 
                a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), 
                a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), 
                a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), 
                a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]");
            }), e(function(a) {
                var b = G.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), 
                a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), 
                J.push(",.*:");
            })), (v.matchesSelector = qa.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", fa);
            }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), 
            b = qa.test(H.compareDocumentPosition), M = b || qa.test(H.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
            } : function(a, b) {
                if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                return !1;
            }, U = b ? function(a, b) {
                if (a === b) return E = !0, 0;
                var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 
                1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === G || a.ownerDocument === O && M(O, a) ? -1 : b === G || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1);
            } : function(a, b) {
                if (a === b) return E = !0, 0;
                var c, d = 0, e = a.parentNode, f = b.parentNode, h = [ a ], i = [ b ];
                if (!e || !f) return a === G ? -1 : b === G ? 1 : e ? -1 : f ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                if (e === f) return g(a, b);
                for (c = a; c = c.parentNode; ) h.unshift(c);
                for (c = b; c = c.parentNode; ) i.unshift(c);
                for (;h[d] === i[d]; ) d++;
                return d ? g(h[d], i[d]) : h[d] === O ? -1 : i[d] === O ? 1 : 0;
            }, G) : G;
        }, b.matches = function(a, c) {
            return b(a, null, null, c);
        }, b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== G && F(a), c = c.replace(ka, "='$1']"), v.matchesSelector && I && !T[c + " "] && (!K || !K.test(c)) && (!J || !J.test(c))) try {
                var d = L.call(a, c);
                if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
            } catch (e) {}
            return b(c, G, null, [ a ]).length > 0;
        }, b.contains = function(a, b) {
            return (a.ownerDocument || a) !== G && F(a), M(a, b);
        }, b.attr = function(a, b) {
            (a.ownerDocument || a) !== G && F(a);
            var c = w.attrHandle[b.toLowerCase()], d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
            return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
        }, b.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a);
        }, b.uniqueSort = function(a) {
            var b, c = [], d = 0, e = 0;
            if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                for (;b = a[e++]; ) b === a[e] && (d = c.push(e));
                for (;d--; ) a.splice(c[d], 1);
            }
            return D = null, a;
        }, x = b.getText = function(a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent) return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling) c += x(a);
                } else if (3 === e || 4 === e) return a.nodeValue;
            } else for (;b = a[d++]; ) c += x(b);
            return c;
        }, w = b.selectors = {
            cacheLength: 50,
            createPseudo: d,
            match: na,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(ua, va), a[3] = (a[3] || a[4] || a[5] || "").replace(ua, va), 
                    "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), 
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), 
                    a;
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return na.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && la.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), 
                    a[2] = c.slice(0, b)), a.slice(0, 3));
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(ua, va).toLowerCase();
                    return "*" === a ? function() {
                        return !0;
                    } : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b;
                    };
                },
                CLASS: function(a) {
                    var b = R[a + " "];
                    return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "");
                    });
                },
                ATTR: function(a, c, d) {
                    return function(e) {
                        var f = b.attr(e, a);
                        return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ga, " ") + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0;
                    };
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode;
                    } : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h, t = !1;
                        if (q) {
                            if (f) {
                                for (;p; ) {
                                    for (m = b; m = m[p]; ) if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                                    o = p = "only" === a && !o && "nextSibling";
                                }
                                return !0;
                            }
                            if (o = [ g ? q.firstChild : q.lastChild ], g && s) {
                                for (m = q, l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), 
                                j = k[a] || [], n = j[0] === P && j[1], t = n && j[2], m = n && q.childNodes[n]; m = ++n && m && m[p] || (t = n = 0) || o.pop(); ) if (1 === m.nodeType && ++t && m === b) {
                                    k[a] = [ P, n, t ];
                                    break;
                                }
                            } else if (s && (m = b, l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), 
                            j = k[a] || [], n = j[0] === P && j[1], t = n), t === !1) for (;(m = ++n && m && m[p] || (t = n = 0) || o.pop()) && ((h ? m.nodeName.toLowerCase() !== r : 1 !== m.nodeType) || !++t || (s && (l = m[N] || (m[N] = {}), 
                            k = l[m.uniqueID] || (l[m.uniqueID] = {}), k[a] = [ P, t ]), m !== b)); ) ;
                            return t -= e, t === d || t % d === 0 && t / d >= 0;
                        }
                    };
                },
                PSEUDO: function(a, c) {
                    var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return f[N] ? f(c) : f.length > 1 ? (e = [ a, a, "", c ], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                        for (var d, e = f(a, c), g = e.length; g--; ) d = aa(a, e[g]), a[d] = !(b[d] = e[g]);
                    }) : function(a) {
                        return f(a, 0, e);
                    }) : f;
                }
            },
            pseudos: {
                not: d(function(a) {
                    var b = [], c = [], e = A(a.replace(ha, "$1"));
                    return e[N] ? d(function(a, b, c, d) {
                        for (var f, g = e(a, null, d, []), h = a.length; h--; ) (f = g[h]) && (a[h] = !(b[h] = f));
                    }) : function(a, d, f) {
                        return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop();
                    };
                }),
                has: d(function(a) {
                    return function(c) {
                        return b(a, c).length > 0;
                    };
                }),
                contains: d(function(a) {
                    return a = a.replace(ua, va), function(b) {
                        return (b.textContent || b.innerText || x(b)).indexOf(a) > -1;
                    };
                }),
                lang: d(function(a) {
                    return ma.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(ua, va).toLowerCase(), 
                    function(b) {
                        var c;
                        do if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), 
                        c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1;
                    };
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id;
                },
                root: function(a) {
                    return a === H;
                },
                focus: function(a) {
                    return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
                },
                enabled: function(a) {
                    return a.disabled === !1;
                },
                disabled: function(a) {
                    return a.disabled === !0;
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected;
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
                    return !0;
                },
                parent: function(a) {
                    return !w.pseudos.empty(a);
                },
                header: function(a) {
                    return pa.test(a.nodeName);
                },
                input: function(a) {
                    return oa.test(a.nodeName);
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b;
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
                },
                first: j(function() {
                    return [ 0 ];
                }),
                last: j(function(a, b) {
                    return [ b - 1 ];
                }),
                eq: j(function(a, b, c) {
                    return [ 0 > c ? c + b : c ];
                }),
                even: j(function(a, b) {
                    for (var c = 0; b > c; c += 2) a.push(c);
                    return a;
                }),
                odd: j(function(a, b) {
                    for (var c = 1; b > c; c += 2) a.push(c);
                    return a;
                }),
                lt: j(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d);
                    return a;
                }),
                gt: j(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d);
                    return a;
                })
            }
        }, w.pseudos.nth = w.pseudos.eq;
        for (u in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) w.pseudos[u] = h(u);
        for (u in {
            submit: !0,
            reset: !0
        }) w.pseudos[u] = i(u);
        return l.prototype = w.filters = w.pseudos, w.setFilters = new l(), z = b.tokenize = function(a, c) {
            var d, e, f, g, h, i, j, k = S[a + " "];
            if (k) return c ? 0 : k.slice(0);
            for (h = a, i = [], j = w.preFilter; h; ) {
                (!d || (e = ia.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), 
                d = !1, (e = ja.exec(h)) && (d = e.shift(), f.push({
                    value: d,
                    type: e[0].replace(ha, " ")
                }), h = h.slice(d.length));
                for (g in w.filter) !(e = na[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), 
                f.push({
                    value: d,
                    type: g,
                    matches: e
                }), h = h.slice(d.length));
                if (!d) break;
            }
            return c ? h.length : h ? b.error(a) : S(a, i).slice(0);
        }, A = b.compile = function(a, b) {
            var c, d = [], e = [], f = T[a + " "];
            if (!f) {
                for (b || (b = z(a)), c = b.length; c--; ) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                f = T(a, t(e, d)), f.selector = a;
            }
            return f;
        }, B = b.select = function(a, b, c, d) {
            var e, f, g, h, i, j = "function" == typeof a && a, l = !d && z(a = j.selector || a);
            if (c = c || [], 1 === l.length) {
                if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                    if (b = (w.find.ID(g.matches[0].replace(ua, va), b) || [])[0], !b) return c;
                    j && (b = b.parentNode), a = a.slice(f.shift().value.length);
                }
                for (e = na.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]); ) if ((i = w.find[h]) && (d = i(g.matches[0].replace(ua, va), sa.test(f[0].type) && k(b.parentNode) || b))) {
                    if (f.splice(e, 1), a = d.length && m(f), !a) return $.apply(c, d), c;
                    break;
                }
            }
            return (j || A(a, l))(d, b, !I, c, !b || sa.test(a) && k(b.parentNode) || b), c;
        }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, 
        F(), v.sortDetached = e(function(a) {
            return 1 & a.compareDocumentPosition(G.createElement("div"));
        }), e(function(a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
        }) || f("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
        }), v.attributes && e(function(a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
        }) || f("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
        }), e(function(a) {
            return null == a.getAttribute("disabled");
        }) || f(ba, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
        }), b;
    }(a);
    na.find = sa, na.expr = sa.selectors, na.expr[":"] = na.expr.pseudos, na.uniqueSort = na.unique = sa.uniqueSort, 
    na.text = sa.getText, na.isXMLDoc = sa.isXML, na.contains = sa.contains;
    var ta = function(a, b, c) {
        for (var d = [], e = void 0 !== c; (a = a[b]) && 9 !== a.nodeType; ) if (1 === a.nodeType) {
            if (e && na(a).is(c)) break;
            d.push(a);
        }
        return d;
    }, ua = function(a, b) {
        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
        return c;
    }, va = na.expr.match.needsContext, wa = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, xa = /^.[^:#\[\.,]*$/;
    na.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? na.find.matchesSelector(d, a) ? [ d ] : [] : na.find.matches(a, na.grep(b, function(a) {
            return 1 === a.nodeType;
        }));
    }, na.fn.extend({
        find: function(a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a) return this.pushStack(na(a).filter(function() {
                for (b = 0; e > b; b++) if (na.contains(d[b], this)) return !0;
            }));
            for (b = 0; e > b; b++) na.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? na.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, 
            c;
        },
        filter: function(a) {
            return this.pushStack(d(this, a || [], !1));
        },
        not: function(a) {
            return this.pushStack(d(this, a || [], !0));
        },
        is: function(a) {
            return !!d(this, "string" == typeof a && va.test(a) ? na(a) : a || [], !1).length;
        }
    });
    var ya, za = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, Aa = na.fn.init = function(a, b, c) {
        var d, e;
        if (!a) return this;
        if (c = c || ya, "string" == typeof a) {
            if (d = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [ null, a, null ] : za.exec(a), 
            !d || !d[1] && b) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
            if (d[1]) {
                if (b = b instanceof na ? b[0] : b, na.merge(this, na.parseHTML(d[1], b && b.nodeType ? b.ownerDocument || b : da, !0)), 
                wa.test(d[1]) && na.isPlainObject(b)) for (d in b) na.isFunction(this[d]) ? this[d](b[d]) : this.attr(d, b[d]);
                return this;
            }
            if (e = da.getElementById(d[2]), e && e.parentNode) {
                if (e.id !== d[2]) return ya.find(a);
                this.length = 1, this[0] = e;
            }
            return this.context = da, this.selector = a, this;
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : na.isFunction(a) ? "undefined" != typeof c.ready ? c.ready(a) : a(na) : (void 0 !== a.selector && (this.selector = a.selector, 
        this.context = a.context), na.makeArray(a, this));
    };
    Aa.prototype = na.fn, ya = na(da);
    var Ba = /^(?:parents|prev(?:Until|All))/, Ca = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    na.fn.extend({
        has: function(a) {
            var b, c = na(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++) if (na.contains(this, c[b])) return !0;
            });
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = va.test(a) || "string" != typeof a ? na(a, b || this.context) : 0; e > d; d++) for (c = this[d]; c && c !== b; c = c.parentNode) if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && na.find.matchesSelector(c, a))) {
                f.push(c);
                break;
            }
            return this.pushStack(f.length > 1 ? na.uniqueSort(f) : f);
        },
        index: function(a) {
            return a ? "string" == typeof a ? na.inArray(this[0], na(a)) : na.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(a, b) {
            return this.pushStack(na.uniqueSort(na.merge(this.get(), na(a, b))));
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
        }
    }), na.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null;
        },
        parents: function(a) {
            return ta(a, "parentNode");
        },
        parentsUntil: function(a, b, c) {
            return ta(a, "parentNode", c);
        },
        next: function(a) {
            return e(a, "nextSibling");
        },
        prev: function(a) {
            return e(a, "previousSibling");
        },
        nextAll: function(a) {
            return ta(a, "nextSibling");
        },
        prevAll: function(a) {
            return ta(a, "previousSibling");
        },
        nextUntil: function(a, b, c) {
            return ta(a, "nextSibling", c);
        },
        prevUntil: function(a, b, c) {
            return ta(a, "previousSibling", c);
        },
        siblings: function(a) {
            return ua((a.parentNode || {}).firstChild, a);
        },
        children: function(a) {
            return ua(a.firstChild);
        },
        contents: function(a) {
            return na.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : na.merge([], a.childNodes);
        }
    }, function(a, b) {
        na.fn[a] = function(c, d) {
            var e = na.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = na.filter(d, e)), 
            this.length > 1 && (Ca[a] || (e = na.uniqueSort(e)), Ba.test(a) && (e = e.reverse())), 
            this.pushStack(e);
        };
    });
    var Da = /\S+/g;
    na.Callbacks = function(a) {
        a = "string" == typeof a ? f(a) : na.extend({}, a);
        var b, c, d, e, g = [], h = [], i = -1, j = function() {
            for (e = a.once, d = b = !0; h.length; i = -1) for (c = h.shift(); ++i < g.length; ) g[i].apply(c[0], c[1]) === !1 && a.stopOnFalse && (i = g.length, 
            c = !1);
            a.memory || (c = !1), b = !1, e && (g = c ? [] : "");
        }, k = {
            add: function() {
                return g && (c && !b && (i = g.length - 1, h.push(c)), function d(b) {
                    na.each(b, function(b, c) {
                        na.isFunction(c) ? a.unique && k.has(c) || g.push(c) : c && c.length && "string" !== na.type(c) && d(c);
                    });
                }(arguments), c && !b && j()), this;
            },
            remove: function() {
                return na.each(arguments, function(a, b) {
                    for (var c; (c = na.inArray(b, g, c)) > -1; ) g.splice(c, 1), i >= c && i--;
                }), this;
            },
            has: function(a) {
                return a ? na.inArray(a, g) > -1 : g.length > 0;
            },
            empty: function() {
                return g && (g = []), this;
            },
            disable: function() {
                return e = h = [], g = c = "", this;
            },
            disabled: function() {
                return !g;
            },
            lock: function() {
                return e = !0, c || k.disable(), this;
            },
            locked: function() {
                return !!e;
            },
            fireWith: function(a, c) {
                return e || (c = c || [], c = [ a, c.slice ? c.slice() : c ], h.push(c), b || j()), 
                this;
            },
            fire: function() {
                return k.fireWith(this, arguments), this;
            },
            fired: function() {
                return !!d;
            }
        };
        return k;
    }, na.extend({
        Deferred: function(a) {
            var b = [ [ "resolve", "done", na.Callbacks("once memory"), "resolved" ], [ "reject", "fail", na.Callbacks("once memory"), "rejected" ], [ "notify", "progress", na.Callbacks("memory") ] ], c = "pending", d = {
                state: function() {
                    return c;
                },
                always: function() {
                    return e.done(arguments).fail(arguments), this;
                },
                then: function() {
                    var a = arguments;
                    return na.Deferred(function(c) {
                        na.each(b, function(b, f) {
                            var g = na.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && na.isFunction(a.promise) ? a.promise().progress(c.notify).done(c.resolve).fail(c.reject) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [ a ] : arguments);
                            });
                        }), a = null;
                    }).promise();
                },
                promise: function(a) {
                    return null != a ? na.extend(a, d) : d;
                }
            }, e = {};
            return d.pipe = d.then, na.each(b, function(a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h;
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this;
                }, e[f[0] + "With"] = g.fireWith;
            }), d.promise(e), a && a.call(e, e), e;
        },
        when: function(a) {
            var b, c, d, e = 0, f = ea.call(arguments), g = f.length, h = 1 !== g || a && na.isFunction(a.promise) ? g : 0, i = 1 === h ? a : na.Deferred(), j = function(a, c, d) {
                return function(e) {
                    c[a] = this, d[a] = arguments.length > 1 ? ea.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d);
                };
            };
            if (g > 1) for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && na.isFunction(f[e].promise) ? f[e].promise().progress(j(e, c, b)).done(j(e, d, f)).fail(i.reject) : --h;
            return h || i.resolveWith(d, f), i.promise();
        }
    });
    var Ea;
    na.fn.ready = function(a) {
        return na.ready.promise().done(a), this;
    }, na.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? na.readyWait++ : na.ready(!0);
        },
        ready: function(a) {
            (a === !0 ? --na.readyWait : na.isReady) || (na.isReady = !0, a !== !0 && --na.readyWait > 0 || (Ea.resolveWith(da, [ na ]), 
            na.fn.triggerHandler && (na(da).triggerHandler("ready"), na(da).off("ready"))));
        }
    }), na.ready.promise = function(b) {
        if (!Ea) if (Ea = na.Deferred(), "complete" === da.readyState) a.setTimeout(na.ready); else if (da.addEventListener) da.addEventListener("DOMContentLoaded", h), 
        a.addEventListener("load", h); else {
            da.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
            var c = !1;
            try {
                c = null == a.frameElement && da.documentElement;
            } catch (d) {}
            c && c.doScroll && !function e() {
                if (!na.isReady) {
                    try {
                        c.doScroll("left");
                    } catch (b) {
                        return a.setTimeout(e, 50);
                    }
                    g(), na.ready();
                }
            }();
        }
        return Ea.promise(b);
    }, na.ready.promise();
    var Fa;
    for (Fa in na(la)) break;
    la.ownFirst = "0" === Fa, la.inlineBlockNeedsLayout = !1, na(function() {
        var a, b, c, d;
        c = da.getElementsByTagName("body")[0], c && c.style && (b = da.createElement("div"), 
        d = da.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", 
        c.appendChild(d).appendChild(b), "undefined" != typeof b.style.zoom && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", 
        la.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d));
    }), function() {
        var a = da.createElement("div");
        la.deleteExpando = !0;
        try {
            delete a.test;
        } catch (b) {
            la.deleteExpando = !1;
        }
        a = null;
    }();
    var Ga = function(a) {
        var b = na.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b;
    }, Ha = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Ia = /([A-Z])/g;
    na.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? na.cache[a[na.expando]] : a[na.expando], !!a && !j(a);
        },
        data: function(a, b, c) {
            return k(a, b, c);
        },
        removeData: function(a, b) {
            return l(a, b);
        },
        _data: function(a, b, c) {
            return k(a, b, c, !0);
        },
        _removeData: function(a, b) {
            return l(a, b, !0);
        }
    }), na.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = na.data(f), 1 === f.nodeType && !na._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--; ) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = na.camelCase(d.slice(5)), 
                    i(f, d, e[d])));
                    na._data(f, "parsedAttrs", !0);
                }
                return e;
            }
            return "object" == typeof a ? this.each(function() {
                na.data(this, a);
            }) : arguments.length > 1 ? this.each(function() {
                na.data(this, a, b);
            }) : f ? i(f, a, na.data(f, a)) : void 0;
        },
        removeData: function(a) {
            return this.each(function() {
                na.removeData(this, a);
            });
        }
    }), na.extend({
        queue: function(a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = na._data(a, b), c && (!d || na.isArray(c) ? d = na._data(a, b, na.makeArray(c)) : d.push(c)), 
            d || []) : void 0;
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = na.queue(a, b), d = c.length, e = c.shift(), f = na._queueHooks(a, b), g = function() {
                na.dequeue(a, b);
            };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), 
            delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return na._data(a, c) || na._data(a, c, {
                empty: na.Callbacks("once memory").add(function() {
                    na._removeData(a, b + "queue"), na._removeData(a, c);
                })
            });
        }
    }), na.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? na.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = na.queue(this, a, b);
                na._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && na.dequeue(this, a);
            });
        },
        dequeue: function(a) {
            return this.each(function() {
                na.dequeue(this, a);
            });
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", []);
        },
        promise: function(a, b) {
            var c, d = 1, e = na.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [ f ]);
            };
            for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--; ) c = na._data(f[g], a + "queueHooks"), 
            c && c.empty && (d++, c.empty.add(h));
            return h(), e.promise(b);
        }
    }), function() {
        var a;
        la.shrinkWrapBlocks = function() {
            if (null != a) return a;
            a = !1;
            var b, c, d;
            return c = da.getElementsByTagName("body")[0], c && c.style ? (b = da.createElement("div"), 
            d = da.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", 
            c.appendChild(d).appendChild(b), "undefined" != typeof b.style.zoom && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", 
            b.appendChild(da.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), 
            c.removeChild(d), a) : void 0;
        };
    }();
    var Ja = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Ka = new RegExp("^(?:([+-])=|)(" + Ja + ")([a-z%]*)$", "i"), La = [ "Top", "Right", "Bottom", "Left" ], Ma = function(a, b) {
        return a = b || a, "none" === na.css(a, "display") || !na.contains(a.ownerDocument, a);
    }, Na = function(a, b, c, d, e, f, g) {
        var h = 0, i = a.length, j = null == c;
        if ("object" === na.type(c)) {
            e = !0;
            for (h in c) Na(a, b, h, c[h], !0, f, g);
        } else if (void 0 !== d && (e = !0, na.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), 
        b = null) : (j = b, b = function(a, b, c) {
            return j.call(na(a), c);
        })), b)) for (;i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    }, Oa = /^(?:checkbox|radio)$/i, Pa = /<([\w:-]+)/, Qa = /^$|\/(?:java|ecma)script/i, Ra = /^\s+/, Sa = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    !function() {
        var a = da.createElement("div"), b = da.createDocumentFragment(), c = da.createElement("input");
        a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
        la.leadingWhitespace = 3 === a.firstChild.nodeType, la.tbody = !a.getElementsByTagName("tbody").length, 
        la.htmlSerialize = !!a.getElementsByTagName("link").length, la.html5Clone = "<:nav></:nav>" !== da.createElement("nav").cloneNode(!0).outerHTML, 
        c.type = "checkbox", c.checked = !0, b.appendChild(c), la.appendChecked = c.checked, 
        a.innerHTML = "<textarea>x</textarea>", la.noCloneChecked = !!a.cloneNode(!0).lastChild.defaultValue, 
        b.appendChild(a), c = da.createElement("input"), c.setAttribute("type", "radio"), 
        c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), a.appendChild(c), 
        la.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, la.noCloneEvent = !!a.addEventListener, 
        a[na.expando] = 1, la.attributes = !a.getAttribute(na.expando);
    }();
    var Ta = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: la.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
    };
    Ta.optgroup = Ta.option, Ta.tbody = Ta.tfoot = Ta.colgroup = Ta.caption = Ta.thead, 
    Ta.th = Ta.td;
    var Ua = /<|&#?\w+;/, Va = /<tbody/i;
    !function() {
        var b, c, d = da.createElement("div");
        for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        }) c = "on" + b, (la[b] = c in a) || (d.setAttribute(c, "t"), la[b] = d.attributes[c].expando === !1);
        d = null;
    }();
    var Wa = /^(?:input|select|textarea)$/i, Xa = /^key/, Ya = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Za = /^(?:focusinfocus|focusoutblur)$/, $a = /^([^.]*)(?:\.(.+)|)/;
    na.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = na._data(a);
            if (q) {
                for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = na.guid++), 
                (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                    return "undefined" == typeof na || a && na.event.triggered === a.type ? void 0 : na.event.dispatch.apply(k.elem, arguments);
                }, k.elem = a), b = (b || "").match(Da) || [ "" ], h = b.length; h--; ) f = $a.exec(b[h]) || [], 
                n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = na.event.special[n] || {}, 
                n = (e ? j.delegateType : j.bindType) || n, j = na.event.special[n] || {}, l = na.extend({
                    type: n,
                    origType: p,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && na.expr.match.needsContext.test(e),
                    namespace: o.join(".")
                }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), 
                j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), 
                na.event.global[n] = !0);
                a = null;
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = na.hasData(a) && na._data(a);
            if (q && (k = q.events)) {
                for (b = (b || "").match(Da) || [ "" ], j = b.length; j--; ) if (h = $a.exec(b[j]) || [], 
                n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                    for (l = na.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, 
                    m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                    i = f = m.length; f--; ) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), 
                    g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                    i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || na.removeEvent(a, n, q.handle), 
                    delete k[n]);
                } else for (n in k) na.event.remove(a, n + b[j], c, d, !0);
                na.isEmptyObject(k) && (delete q.handle, na._removeData(a, "events"));
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, j, k, l, m = [ d || da ], n = ka.call(b, "type") ? b.type : b, o = ka.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = k = d = d || da, 3 !== d.nodeType && 8 !== d.nodeType && !Za.test(n + na.event.triggered) && (n.indexOf(".") > -1 && (o = n.split("."), 
            n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[na.expando] ? b : new na.Event(n, "object" == typeof b && b), 
            b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
            b.result = void 0, b.target || (b.target = d), c = null == c ? [ b ] : na.makeArray(c, [ b ]), 
            j = na.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                if (!e && !j.noBubble && !na.isWindow(d)) {
                    for (i = j.delegateType || n, Za.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), 
                    k = h;
                    k === (d.ownerDocument || da) && m.push(k.defaultView || k.parentWindow || a);
                }
                for (l = 0; (h = m[l++]) && !b.isPropagationStopped(); ) b.type = l > 1 ? i : j.bindType || n, 
                f = (na._data(h, "events") || {})[b.type] && na._data(h, "handle"), f && f.apply(h, c), 
                f = g && h[g], f && f.apply && Ga(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && Ga(d) && g && d[n] && !na.isWindow(d)) {
                    k = d[g], k && (d[g] = null), na.event.triggered = n;
                    try {
                        d[n]();
                    } catch (p) {}
                    na.event.triggered = void 0, k && (d[g] = k);
                }
                return b.result;
            }
        },
        dispatch: function(a) {
            a = na.event.fix(a);
            var b, c, d, e, f, g = [], h = ea.call(arguments), i = (na._data(this, "events") || {})[a.type] || [], j = na.event.special[a.type] || {};
            if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = na.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped(); ) for (a.currentTarget = e.elem, 
                c = 0; (f = e.handlers[c++]) && !a.isImmediatePropagationStopped(); ) (!a.rnamespace || a.rnamespace.test(f.namespace)) && (a.handleObj = f, 
                a.data = f.data, d = ((na.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, h), 
                void 0 !== d && (a.result = d) === !1 && (a.preventDefault(), a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a), a.result;
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && ("click" !== a.type || isNaN(a.button) || a.button < 1)) for (;i != this; i = i.parentNode || this) if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                for (d = [], c = 0; h > c; c++) f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? na(e, this).index(i) > -1 : na.find(e, this, null, [ i ]).length), 
                d[e] && d.push(f);
                d.length && g.push({
                    elem: i,
                    handlers: d
                });
            }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }), g;
        },
        fix: function(a) {
            if (a[na.expando]) return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Ya.test(e) ? this.mouseHooks : Xa.test(e) ? this.keyHooks : {}), 
            d = g.props ? this.props.concat(g.props) : this.props, a = new na.Event(f), b = d.length; b--; ) c = d[b], 
            a[c] = f[c];
            return a.target || (a.target = f.srcElement || da), 3 === a.target.nodeType && (a.target = a.target.parentNode), 
            a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), 
                a;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || da, 
                e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), 
                a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), 
                !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), 
                a;
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== u() && this.focus) try {
                        return this.focus(), !1;
                    } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === u() && this.blur ? (this.blur(), !1) : void 0;
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return na.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), 
                    !1) : void 0;
                },
                _default: function(a) {
                    return na.nodeName(a.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
                }
            }
        },
        simulate: function(a, b, c) {
            var d = na.extend(new na.Event(), c, {
                type: a,
                isSimulated: !0
            });
            na.event.trigger(d, null, b), d.isDefaultPrevented() && c.preventDefault();
        }
    }, na.removeEvent = da.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c);
    } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && ("undefined" == typeof a[d] && (a[d] = null), a.detachEvent(d, c));
    }, na.Event = function(a, b) {
        return this instanceof na.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, 
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? s : t) : this.type = a, 
        b && na.extend(this, b), this.timeStamp = a && a.timeStamp || na.now(), void (this[na.expando] = !0)) : new na.Event(a, b);
    }, na.Event.prototype = {
        constructor: na.Event,
        isDefaultPrevented: t,
        isPropagationStopped: t,
        isImmediatePropagationStopped: t,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = s, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = s, a && !this.isSimulated && (a.stopPropagation && a.stopPropagation(), 
            a.cancelBubble = !0);
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = s, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), 
            this.stopPropagation();
        }
    }, na.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        na.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return (!e || e !== d && !na.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), 
                a.type = b), c;
            }
        };
    }), la.submit || (na.event.special.submit = {
        setup: function() {
            return na.nodeName(this, "form") ? !1 : void na.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target, c = na.nodeName(b, "input") || na.nodeName(b, "button") ? na.prop(b, "form") : void 0;
                c && !na._data(c, "submit") && (na.event.add(c, "submit._submit", function(a) {
                    a._submitBubble = !0;
                }), na._data(c, "submit", !0));
            });
        },
        postDispatch: function(a) {
            a._submitBubble && (delete a._submitBubble, this.parentNode && !a.isTrigger && na.event.simulate("submit", this.parentNode, a));
        },
        teardown: function() {
            return na.nodeName(this, "form") ? !1 : void na.event.remove(this, "._submit");
        }
    }), la.change || (na.event.special.change = {
        setup: function() {
            return Wa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (na.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._justChanged = !0);
            }), na.event.add(this, "click._change", function(a) {
                this._justChanged && !a.isTrigger && (this._justChanged = !1), na.event.simulate("change", this, a);
            })), !1) : void na.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                Wa.test(b.nodeName) && !na._data(b, "change") && (na.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || na.event.simulate("change", this.parentNode, a);
                }), na._data(b, "change", !0));
            });
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0;
        },
        teardown: function() {
            return na.event.remove(this, "._change"), !Wa.test(this.nodeName);
        }
    }), la.focusin || na.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            na.event.simulate(b, a.target, na.event.fix(a));
        };
        na.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this, e = na._data(d, b);
                e || d.addEventListener(a, c, !0), na._data(d, b, (e || 0) + 1);
            },
            teardown: function() {
                var d = this.ownerDocument || this, e = na._data(d, b) - 1;
                e ? na._data(d, b, e) : (d.removeEventListener(a, c, !0), na._removeData(d, b));
            }
        };
    }), na.fn.extend({
        on: function(a, b, c, d) {
            return v(this, a, b, c, d);
        },
        one: function(a, b, c, d) {
            return v(this, a, b, c, d, 1);
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) return d = a.handleObj, na(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), 
            this;
            if ("object" == typeof a) {
                for (e in a) this.off(e, b, a[e]);
                return this;
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = t), 
            this.each(function() {
                na.event.remove(this, a, c, b);
            });
        },
        trigger: function(a, b) {
            return this.each(function() {
                na.event.trigger(a, b, this);
            });
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? na.event.trigger(a, b, c, !0) : void 0;
        }
    });
    var _a = / jQuery\d+="(?:null|\d+)"/g, ab = new RegExp("<(?:" + Sa + ")[\\s/>]", "i"), bb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, cb = /<script|<style|<link/i, db = /checked\s*(?:[^=]|=\s*.checked.)/i, eb = /^true\/(.*)/, fb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, gb = n(da), hb = gb.appendChild(da.createElement("div"));
    na.extend({
        htmlPrefilter: function(a) {
            return a.replace(bb, "<$1></$2>");
        },
        clone: function(a, b, c) {
            var d, e, f, g, h, i = na.contains(a.ownerDocument, a);
            if (la.html5Clone || na.isXMLDoc(a) || !ab.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (hb.innerHTML = a.outerHTML, 
            hb.removeChild(f = hb.firstChild)), !(la.noCloneEvent && la.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || na.isXMLDoc(a))) for (d = o(f), 
            h = o(a), g = 0; null != (e = h[g]); ++g) d[g] && A(e, d[g]);
            if (b) if (c) for (h = h || o(a), d = d || o(f), g = 0; null != (e = h[g]); g++) z(e, d[g]); else z(a, f);
            return d = o(f, "script"), d.length > 0 && p(d, !i && o(a, "script")), d = h = e = null, 
            f;
        },
        cleanData: function(a, b) {
            for (var c, d, e, f, g = 0, h = na.expando, i = na.cache, j = la.attributes, k = na.event.special; null != (c = a[g]); g++) if ((b || Ga(c)) && (e = c[h], 
            f = e && i[e])) {
                if (f.events) for (d in f.events) k[d] ? na.event.remove(c, d) : na.removeEvent(c, d, f.handle);
                i[e] && (delete i[e], j || "undefined" == typeof c.removeAttribute ? c[h] = void 0 : c.removeAttribute(h), 
                ca.push(e));
            }
        }
    }), na.fn.extend({
        domManip: B,
        detach: function(a) {
            return C(this, a, !0);
        },
        remove: function(a) {
            return C(this, a);
        },
        text: function(a) {
            return Na(this, function(a) {
                return void 0 === a ? na.text(this) : this.empty().append((this[0] && this[0].ownerDocument || da).createTextNode(a));
            }, null, a, arguments.length);
        },
        append: function() {
            return B(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = w(this, a);
                    b.appendChild(a);
                }
            });
        },
        prepend: function() {
            return B(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = w(this, a);
                    b.insertBefore(a, b.firstChild);
                }
            });
        },
        before: function() {
            return B(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this);
            });
        },
        after: function() {
            return B(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
            });
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && na.cleanData(o(a, !1)); a.firstChild; ) a.removeChild(a.firstChild);
                a.options && na.nodeName(a, "select") && (a.options.length = 0);
            }
            return this;
        },
        clone: function(a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                return na.clone(this, a, b);
            });
        },
        html: function(a) {
            return Na(this, function(a) {
                var b = this[0] || {}, c = 0, d = this.length;
                if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(_a, "") : void 0;
                if ("string" == typeof a && !cb.test(a) && (la.htmlSerialize || !ab.test(a)) && (la.leadingWhitespace || !Ra.test(a)) && !Ta[(Pa.exec(a) || [ "", "" ])[1].toLowerCase()]) {
                    a = na.htmlPrefilter(a);
                    try {
                        for (;d > c; c++) b = this[c] || {}, 1 === b.nodeType && (na.cleanData(o(b, !1)), 
                        b.innerHTML = a);
                        b = 0;
                    } catch (e) {}
                }
                b && this.empty().append(a);
            }, null, a, arguments.length);
        },
        replaceWith: function() {
            var a = [];
            return B(this, arguments, function(b) {
                var c = this.parentNode;
                na.inArray(this, a) < 0 && (na.cleanData(o(this)), c && c.replaceChild(b, this));
            }, a);
        }
    }), na.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        na.fn[a] = function(a) {
            for (var c, d = 0, e = [], f = na(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), 
            na(f[d])[b](c), ga.apply(e, c.get());
            return this.pushStack(e);
        };
    });
    var ib, jb = {
        HTML: "block",
        BODY: "block"
    }, kb = /^margin/, lb = new RegExp("^(" + Ja + ")(?!px)[a-z%]+$", "i"), mb = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b) g[f] = a.style[f], a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b) a.style[f] = g[f];
        return e;
    }, nb = da.documentElement;
    !function() {
        function b() {
            var b, k, l = da.documentElement;
            l.appendChild(i), j.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", 
            c = e = h = !1, d = g = !0, a.getComputedStyle && (k = a.getComputedStyle(j), c = "1%" !== (k || {}).top, 
            h = "2px" === (k || {}).marginLeft, e = "4px" === (k || {
                width: "4px"
            }).width, j.style.marginRight = "50%", d = "4px" === (k || {
                marginRight: "4px"
            }).marginRight, b = j.appendChild(da.createElement("div")), b.style.cssText = j.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", 
            b.style.marginRight = b.style.width = "0", j.style.width = "1px", g = !parseFloat((a.getComputedStyle(b) || {}).marginRight), 
            j.removeChild(b)), j.style.display = "none", f = 0 === j.getClientRects().length, 
            f && (j.style.display = "", j.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
            b = j.getElementsByTagName("td"), b[0].style.cssText = "margin:0;border:0;padding:0;display:none", 
            f = 0 === b[0].offsetHeight, f && (b[0].style.display = "", b[1].style.display = "none", 
            f = 0 === b[0].offsetHeight)), l.removeChild(i);
        }
        var c, d, e, f, g, h, i = da.createElement("div"), j = da.createElement("div");
        j.style && (j.style.cssText = "float:left;opacity:.5", la.opacity = "0.5" === j.style.opacity, 
        la.cssFloat = !!j.style.cssFloat, j.style.backgroundClip = "content-box", j.cloneNode(!0).style.backgroundClip = "", 
        la.clearCloneStyle = "content-box" === j.style.backgroundClip, i = da.createElement("div"), 
        i.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", 
        j.innerHTML = "", i.appendChild(j), la.boxSizing = "" === j.style.boxSizing || "" === j.style.MozBoxSizing || "" === j.style.WebkitBoxSizing, 
        na.extend(la, {
            reliableHiddenOffsets: function() {
                return null == c && b(), f;
            },
            boxSizingReliable: function() {
                return null == c && b(), e;
            },
            pixelMarginRight: function() {
                return null == c && b(), d;
            },
            pixelPosition: function() {
                return null == c && b(), c;
            },
            reliableMarginRight: function() {
                return null == c && b(), g;
            },
            reliableMarginLeft: function() {
                return null == c && b(), h;
            }
        }));
    }();
    var ob, pb, qb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (ob = function(b) {
        var c = b.ownerDocument.defaultView;
        return c.opener || (c = a), c.getComputedStyle(b);
    }, pb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || ob(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || na.contains(a.ownerDocument, a) || (g = na.style(a, b)), 
        !la.pixelMarginRight() && lb.test(g) && kb.test(b) && (d = h.width, e = h.minWidth, 
        f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, 
        h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + "";
    }) : nb.currentStyle && (ob = function(a) {
        return a.currentStyle;
    }, pb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || ob(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), 
        lb.test(g) && !qb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), 
        h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), 
        void 0 === g ? g : g + "" || "auto";
    });
    var rb = /alpha\([^)]*\)/i, sb = /opacity\s*=\s*([^)]*)/i, tb = /^(none|table(?!-c[ea]).+)/, ub = new RegExp("^(" + Ja + ")(.*)$", "i"), vb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, wb = {
        letterSpacing: "0",
        fontWeight: "400"
    }, xb = [ "Webkit", "O", "Moz", "ms" ], yb = da.createElement("div").style;
    na.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = pb(a, "opacity");
                        return "" === c ? "1" : c;
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": la.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = na.camelCase(b), i = a.style;
                if (b = na.cssProps[h] || (na.cssProps[h] = G(h) || h), g = na.cssHooks[b] || na.cssHooks[h], 
                void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = Ka.exec(c)) && e[1] && (c = m(a, b, e), 
                f = "number"), null != c && c === c && ("number" === f && (c += e && e[3] || (na.cssNumber[h] ? "" : "px")), 
                la.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), 
                !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                    i[b] = c;
                } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = na.camelCase(b);
            return b = na.cssProps[h] || (na.cssProps[h] = G(h) || h), g = na.cssHooks[b] || na.cssHooks[h], 
            g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = pb(a, b, d)), "normal" === f && b in wb && (f = wb[b]), 
            "" === c || c ? (e = parseFloat(f), c === !0 || isFinite(e) ? e || 0 : f) : f;
        }
    }), na.each([ "height", "width" ], function(a, b) {
        na.cssHooks[b] = {
            get: function(a, c, d) {
                return c ? tb.test(na.css(a, "display")) && 0 === a.offsetWidth ? mb(a, vb, function() {
                    return K(a, b, d);
                }) : K(a, b, d) : void 0;
            },
            set: function(a, c, d) {
                var e = d && ob(a);
                return I(a, c, d ? J(a, b, d, la.boxSizing && "border-box" === na.css(a, "boxSizing", !1, e), e) : 0);
            }
        };
    }), la.opacity || (na.cssHooks.opacity = {
        get: function(a, b) {
            return sb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
        },
        set: function(a, b) {
            var c = a.style, d = a.currentStyle, e = na.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === na.trim(f.replace(rb, "")) && c.removeAttribute && (c.removeAttribute("filter"), 
            "" === b || d && !d.filter) || (c.filter = rb.test(f) ? f.replace(rb, e) : f + " " + e);
        }
    }), na.cssHooks.marginRight = F(la.reliableMarginRight, function(a, b) {
        return b ? mb(a, {
            display: "inline-block"
        }, pb, [ a, "marginRight" ]) : void 0;
    }), na.cssHooks.marginLeft = F(la.reliableMarginLeft, function(a, b) {
        return b ? (parseFloat(pb(a, "marginLeft")) || (na.contains(a.ownerDocument, a) ? a.getBoundingClientRect().left - mb(a, {
            marginLeft: 0
        }, function() {
            return a.getBoundingClientRect().left;
        }) : 0)) + "px" : void 0;
    }), na.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        na.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [ c ]; 4 > d; d++) e[a + La[d] + b] = f[d] || f[d - 2] || f[0];
                return e;
            }
        }, kb.test(a) || (na.cssHooks[a + b].set = I);
    }), na.fn.extend({
        css: function(a, b) {
            return Na(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (na.isArray(b)) {
                    for (d = ob(a), e = b.length; e > g; g++) f[b[g]] = na.css(a, b[g], !1, d);
                    return f;
                }
                return void 0 !== c ? na.style(a, b, c) : na.css(a, b);
            }, a, b, arguments.length > 1);
        },
        show: function() {
            return H(this, !0);
        },
        hide: function() {
            return H(this);
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                Ma(this) ? na(this).show() : na(this).hide();
            });
        }
    }), na.Tween = L, L.prototype = {
        constructor: L,
        init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || na.easing._default, this.options = b, 
            this.start = this.now = this.cur(), this.end = d, this.unit = f || (na.cssNumber[c] ? "" : "px");
        },
        cur: function() {
            var a = L.propHooks[this.prop];
            return a && a.get ? a.get(this) : L.propHooks._default.get(this);
        },
        run: function(a) {
            var b, c = L.propHooks[this.prop];
            return this.options.duration ? this.pos = b = na.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, 
            this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
            c && c.set ? c.set(this) : L.propHooks._default.set(this), this;
        }
    }, L.prototype.init.prototype = L.prototype, L.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = na.css(a.elem, a.prop, ""), 
                b && "auto" !== b ? b : 0);
            },
            set: function(a) {
                na.fx.step[a.prop] ? na.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[na.cssProps[a.prop]] && !na.cssHooks[a.prop] ? a.elem[a.prop] = a.now : na.style(a.elem, a.prop, a.now + a.unit);
            }
        }
    }, L.propHooks.scrollTop = L.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
        }
    }, na.easing = {
        linear: function(a) {
            return a;
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2;
        },
        _default: "swing"
    }, na.fx = L.prototype.init, na.fx.step = {};
    var zb, Ab, Bb = /^(?:toggle|show|hide)$/, Cb = /queueHooks$/;
    na.Animation = na.extend(R, {
        tweeners: {
            "*": [ function(a, b) {
                var c = this.createTween(a, b);
                return m(c.elem, a, Ka.exec(b), c), c;
            } ]
        },
        tweener: function(a, b) {
            na.isFunction(a) ? (b = a, a = [ "*" ]) : a = a.match(Da);
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], R.tweeners[c] = R.tweeners[c] || [], 
            R.tweeners[c].unshift(b);
        },
        prefilters: [ P ],
        prefilter: function(a, b) {
            b ? R.prefilters.unshift(a) : R.prefilters.push(a);
        }
    }), na.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? na.extend({}, a) : {
            complete: c || !c && b || na.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !na.isFunction(b) && b
        };
        return d.duration = na.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in na.fx.speeds ? na.fx.speeds[d.duration] : na.fx.speeds._default, 
        (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            na.isFunction(d.old) && d.old.call(this), d.queue && na.dequeue(this, d.queue);
        }, d;
    }, na.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(Ma).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d);
        },
        animate: function(a, b, c, d) {
            var e = na.isEmptyObject(a), f = na.speed(b, c, d), g = function() {
                var b = R(this, na.extend({}, a), f);
                (e || na._data(this, "finish")) && b.stop(!0);
            };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c);
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), 
            this.each(function() {
                var b = !0, e = null != a && a + "queueHooks", f = na.timers, g = na._data(this);
                if (e) g[e] && g[e].stop && d(g[e]); else for (e in g) g[e] && g[e].stop && Cb.test(e) && d(g[e]);
                for (e = f.length; e--; ) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), 
                b = !1, f.splice(e, 1));
                (b || !c) && na.dequeue(this, a);
            });
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b, c = na._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = na.timers, g = d ? d.length : 0;
                for (c.finish = !0, na.queue(this, a, []), e && e.stop && e.stop.call(this, !0), 
                b = f.length; b--; ) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), 
                f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish;
            });
        }
    }), na.each([ "toggle", "show", "hide" ], function(a, b) {
        var c = na.fn[b];
        na.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(N(b, !0), a, d, e);
        };
    }), na.each({
        slideDown: N("show"),
        slideUp: N("hide"),
        slideToggle: N("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        na.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d);
        };
    }), na.timers = [], na.fx.tick = function() {
        var a, b = na.timers, c = 0;
        for (zb = na.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || na.fx.stop(), zb = void 0;
    }, na.fx.timer = function(a) {
        na.timers.push(a), a() ? na.fx.start() : na.timers.pop();
    }, na.fx.interval = 13, na.fx.start = function() {
        Ab || (Ab = a.setInterval(na.fx.tick, na.fx.interval));
    }, na.fx.stop = function() {
        a.clearInterval(Ab), Ab = null;
    }, na.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, na.fn.delay = function(b, c) {
        return b = na.fx ? na.fx.speeds[b] || b : b, c = c || "fx", this.queue(c, function(c, d) {
            var e = a.setTimeout(c, b);
            d.stop = function() {
                a.clearTimeout(e);
            };
        });
    }, function() {
        var a, b = da.createElement("input"), c = da.createElement("div"), d = da.createElement("select"), e = d.appendChild(da.createElement("option"));
        c = da.createElement("div"), c.setAttribute("className", "t"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
        a = c.getElementsByTagName("a")[0], b.setAttribute("type", "checkbox"), c.appendChild(b), 
        a = c.getElementsByTagName("a")[0], a.style.cssText = "top:1px", la.getSetAttribute = "t" !== c.className, 
        la.style = /top/.test(a.getAttribute("style")), la.hrefNormalized = "/a" === a.getAttribute("href"), 
        la.checkOn = !!b.value, la.optSelected = e.selected, la.enctype = !!da.createElement("form").enctype, 
        d.disabled = !0, la.optDisabled = !e.disabled, b = da.createElement("input"), b.setAttribute("value", ""), 
        la.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), 
        la.radioValue = "t" === b.value;
    }();
    var Db = /\r/g;
    na.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            return arguments.length ? (d = na.isFunction(a), this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, na(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : na.isArray(e) && (e = na.map(e, function(a) {
                    return null == a ? "" : a + "";
                })), b = na.valHooks[this.type] || na.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
            })) : e ? (b = na.valHooks[e.type] || na.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, 
            "string" == typeof c ? c.replace(Db, "") : null == c ? "" : c)) : void 0;
        }
    }), na.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = na.find.attr(a, "value");
                    return null != b ? b : na.trim(na.text(a));
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) if (c = d[i], 
                    (c.selected || i === e) && (la.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !na.nodeName(c.parentNode, "optgroup"))) {
                        if (b = na(c).val(), f) return b;
                        g.push(b);
                    }
                    return g;
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = na.makeArray(b), g = e.length; g--; ) if (d = e[g], 
                    na.inArray(na.valHooks.option.get(d), f) >= 0) try {
                        d.selected = c = !0;
                    } catch (h) {
                        d.scrollHeight;
                    } else d.selected = !1;
                    return c || (a.selectedIndex = -1), e;
                }
            }
        }
    }), na.each([ "radio", "checkbox" ], function() {
        na.valHooks[this] = {
            set: function(a, b) {
                return na.isArray(b) ? a.checked = na.inArray(na(a).val(), b) > -1 : void 0;
            }
        }, la.checkOn || (na.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value;
        });
    });
    var Eb, Fb, Gb = na.expr.attrHandle, Hb = /^(?:checked|selected)$/i, Ib = la.getSetAttribute, Jb = la.input;
    na.fn.extend({
        attr: function(a, b) {
            return Na(this, na.attr, a, b, arguments.length > 1);
        },
        removeAttr: function(a) {
            return this.each(function() {
                na.removeAttr(this, a);
            });
        }
    }), na.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            return 3 !== f && 8 !== f && 2 !== f ? "undefined" == typeof a.getAttribute ? na.prop(a, b, c) : (1 === f && na.isXMLDoc(a) || (b = b.toLowerCase(), 
            e = na.attrHooks[b] || (na.expr.match.bool.test(b) ? Fb : Eb)), void 0 !== c ? null === c ? void na.removeAttr(a, b) : e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), 
            c) : e && "get" in e && null !== (d = e.get(a, b)) ? d : (d = na.find.attr(a, b), 
            null == d ? void 0 : d)) : void 0;
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!la.radioValue && "radio" === b && na.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b;
                    }
                }
            }
        },
        removeAttr: function(a, b) {
            var c, d, e = 0, f = b && b.match(Da);
            if (f && 1 === a.nodeType) for (;c = f[e++]; ) d = na.propFix[c] || c, na.expr.match.bool.test(c) ? Jb && Ib || !Hb.test(c) ? a[d] = !1 : a[na.camelCase("default-" + c)] = a[d] = !1 : na.attr(a, c, ""), 
            a.removeAttribute(Ib ? c : d);
        }
    }), Fb = {
        set: function(a, b, c) {
            return b === !1 ? na.removeAttr(a, c) : Jb && Ib || !Hb.test(c) ? a.setAttribute(!Ib && na.propFix[c] || c, c) : a[na.camelCase("default-" + c)] = a[c] = !0, 
            c;
        }
    }, na.each(na.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = Gb[b] || na.find.attr;
        Jb && Ib || !Hb.test(b) ? Gb[b] = function(a, b, d) {
            var e, f;
            return d || (f = Gb[b], Gb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, 
            Gb[b] = f), e;
        } : Gb[b] = function(a, b, c) {
            return c ? void 0 : a[na.camelCase("default-" + b)] ? b.toLowerCase() : null;
        };
    }), Jb && Ib || (na.attrHooks.value = {
        set: function(a, b, c) {
            return na.nodeName(a, "input") ? void (a.defaultValue = b) : Eb && Eb.set(a, b, c);
        }
    }), Ib || (Eb = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", 
            "value" === c || b === a.getAttribute(c) ? b : void 0;
        }
    }, Gb.id = Gb.name = Gb.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null;
    }, na.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0;
        },
        set: Eb.set
    }, na.attrHooks.contenteditable = {
        set: function(a, b, c) {
            Eb.set(a, "" === b ? !1 : b, c);
        }
    }, na.each([ "width", "height" ], function(a, b) {
        na.attrHooks[b] = {
            set: function(a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0;
            }
        };
    })), la.style || (na.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0;
        },
        set: function(a, b) {
            return a.style.cssText = b + "";
        }
    });
    var Kb = /^(?:input|select|textarea|button|object)$/i, Lb = /^(?:a|area)$/i;
    na.fn.extend({
        prop: function(a, b) {
            return Na(this, na.prop, a, b, arguments.length > 1);
        },
        removeProp: function(a) {
            return a = na.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a];
                } catch (b) {}
            });
        }
    }), na.extend({
        prop: function(a, b, c) {
            var d, e, f = a.nodeType;
            return 3 !== f && 8 !== f && 2 !== f ? (1 === f && na.isXMLDoc(a) || (b = na.propFix[b] || b, 
            e = na.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]) : void 0;
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = na.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : Kb.test(a.nodeName) || Lb.test(a.nodeName) && a.href ? 0 : -1;
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), la.hrefNormalized || na.each([ "href", "src" ], function(a, b) {
        na.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4);
            }
        };
    }), la.optSelected || (na.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
        }
    }), na.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        na.propFix[this.toLowerCase()] = this;
    }), la.enctype || (na.propFix.enctype = "encoding");
    var Mb = /[\t\r\n\f]/g;
    na.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (na.isFunction(a)) return this.each(function(b) {
                na(this).addClass(a.call(this, b, S(this)));
            });
            if ("string" == typeof a && a) for (b = a.match(Da) || []; c = this[i++]; ) if (e = S(c), 
            d = 1 === c.nodeType && (" " + e + " ").replace(Mb, " ")) {
                for (g = 0; f = b[g++]; ) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                h = na.trim(d), e !== h && na.attr(c, "class", h);
            }
            return this;
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (na.isFunction(a)) return this.each(function(b) {
                na(this).removeClass(a.call(this, b, S(this)));
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof a && a) for (b = a.match(Da) || []; c = this[i++]; ) if (e = S(c), 
            d = 1 === c.nodeType && (" " + e + " ").replace(Mb, " ")) {
                for (g = 0; f = b[g++]; ) for (;d.indexOf(" " + f + " ") > -1; ) d = d.replace(" " + f + " ", " ");
                h = na.trim(d), e !== h && na.attr(c, "class", h);
            }
            return this;
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : na.isFunction(a) ? this.each(function(c) {
                na(this).toggleClass(a.call(this, c, S(this), b), b);
            }) : this.each(function() {
                var b, d, e, f;
                if ("string" === c) for (d = 0, e = na(this), f = a.match(Da) || []; b = f[d++]; ) e.hasClass(b) ? e.removeClass(b) : e.addClass(b); else (void 0 === a || "boolean" === c) && (b = S(this), 
                b && na._data(this, "__className__", b), na.attr(this, "class", b || a === !1 ? "" : na._data(this, "__className__") || ""));
            });
        },
        hasClass: function(a) {
            var b, c, d = 0;
            for (b = " " + a + " "; c = this[d++]; ) if (1 === c.nodeType && (" " + S(c) + " ").replace(Mb, " ").indexOf(b) > -1) return !0;
            return !1;
        }
    }), na.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        na.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
        };
    }), na.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a);
        }
    });
    var Nb = a.location, Ob = na.now(), Pb = /\?/, Qb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    na.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
        var c, d = null, e = na.trim(b + "");
        return e && !na.trim(e.replace(Qb, function(a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "");
        })) ? Function("return " + e)() : na.error("Invalid JSON: " + b);
    }, na.parseXML = function(b) {
        var c, d;
        if (!b || "string" != typeof b) return null;
        try {
            a.DOMParser ? (d = new a.DOMParser(), c = d.parseFromString(b, "text/xml")) : (c = new a.ActiveXObject("Microsoft.XMLDOM"), 
            c.async = "false", c.loadXML(b));
        } catch (e) {
            c = void 0;
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || na.error("Invalid XML: " + b), 
        c;
    };
    var Rb = /#.*$/, Sb = /([?&])_=[^&]*/, Tb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Ub = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Vb = /^(?:GET|HEAD)$/, Wb = /^\/\//, Xb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Yb = {}, Zb = {}, $b = "*/".concat("*"), _b = Nb.href, ac = Xb.exec(_b.toLowerCase()) || [];
    na.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: _b,
            type: "GET",
            isLocal: Ub.test(ac[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": $b,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": na.parseJSON,
                "text xml": na.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? V(V(a, na.ajaxSettings), b) : V(na.ajaxSettings, a);
        },
        ajaxPrefilter: T(Yb),
        ajaxTransport: T(Zb),
        ajax: function(b, c) {
            function d(b, c, d, e) {
                var f, l, s, t, v, x = c;
                2 !== u && (u = 2, i && a.clearTimeout(i), k = void 0, h = e || "", w.readyState = b > 0 ? 4 : 0, 
                f = b >= 200 && 300 > b || 304 === b, d && (t = W(m, w, d)), t = X(m, t, w, f), 
                f ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && (na.lastModified[g] = v), 
                v = w.getResponseHeader("etag"), v && (na.etag[g] = v)), 204 === b || "HEAD" === m.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = t.state, 
                l = t.data, s = t.error, f = !s)) : (s = x, (b || !x) && (x = "error", 0 > b && (b = 0))), 
                w.status = b, w.statusText = (c || x) + "", f ? p.resolveWith(n, [ l, x, w ]) : p.rejectWith(n, [ w, x, s ]), 
                w.statusCode(r), r = void 0, j && o.trigger(f ? "ajaxSuccess" : "ajaxError", [ w, m, f ? l : s ]), 
                q.fireWith(n, [ w, x ]), j && (o.trigger("ajaxComplete", [ w, m ]), --na.active || na.event.trigger("ajaxStop")));
            }
            "object" == typeof b && (c = b, b = void 0), c = c || {};
            var e, f, g, h, i, j, k, l, m = na.ajaxSetup({}, c), n = m.context || m, o = m.context && (n.nodeType || n.jquery) ? na(n) : na.event, p = na.Deferred(), q = na.Callbacks("once memory"), r = m.statusCode || {}, s = {}, t = {}, u = 0, v = "canceled", w = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === u) {
                        if (!l) for (l = {}; b = Tb.exec(h); ) l[b[1].toLowerCase()] = b[2];
                        b = l[a.toLowerCase()];
                    }
                    return null == b ? null : b;
                },
                getAllResponseHeaders: function() {
                    return 2 === u ? h : null;
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return u || (a = t[c] = t[c] || a, s[a] = b), this;
                },
                overrideMimeType: function(a) {
                    return u || (m.mimeType = a), this;
                },
                statusCode: function(a) {
                    var b;
                    if (a) if (2 > u) for (b in a) r[b] = [ r[b], a[b] ]; else w.always(a[w.status]);
                    return this;
                },
                abort: function(a) {
                    var b = a || v;
                    return k && k.abort(b), d(0, b), this;
                }
            };
            if (p.promise(w).complete = q.add, w.success = w.done, w.error = w.fail, m.url = ((b || m.url || _b) + "").replace(Rb, "").replace(Wb, ac[1] + "//"), 
            m.type = c.method || c.type || m.method || m.type, m.dataTypes = na.trim(m.dataType || "*").toLowerCase().match(Da) || [ "" ], 
            null == m.crossDomain && (e = Xb.exec(m.url.toLowerCase()), m.crossDomain = !(!e || e[1] === ac[1] && e[2] === ac[2] && (e[3] || ("http:" === e[1] ? "80" : "443")) === (ac[3] || ("http:" === ac[1] ? "80" : "443")))), 
            m.data && m.processData && "string" != typeof m.data && (m.data = na.param(m.data, m.traditional)), 
            U(Yb, m, c, w), 2 === u) return w;
            j = na.event && m.global, j && 0 === na.active++ && na.event.trigger("ajaxStart"), 
            m.type = m.type.toUpperCase(), m.hasContent = !Vb.test(m.type), g = m.url, m.hasContent || (m.data && (g = m.url += (Pb.test(g) ? "&" : "?") + m.data, 
            delete m.data), m.cache === !1 && (m.url = Sb.test(g) ? g.replace(Sb, "$1_=" + Ob++) : g + (Pb.test(g) ? "&" : "?") + "_=" + Ob++)), 
            m.ifModified && (na.lastModified[g] && w.setRequestHeader("If-Modified-Since", na.lastModified[g]), 
            na.etag[g] && w.setRequestHeader("If-None-Match", na.etag[g])), (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType), 
            w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + $b + "; q=0.01" : "") : m.accepts["*"]);
            for (f in m.headers) w.setRequestHeader(f, m.headers[f]);
            if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u)) return w.abort();
            v = "abort";
            for (f in {
                success: 1,
                error: 1,
                complete: 1
            }) w[f](m[f]);
            if (k = U(Zb, m, c, w)) {
                if (w.readyState = 1, j && o.trigger("ajaxSend", [ w, m ]), 2 === u) return w;
                m.async && m.timeout > 0 && (i = a.setTimeout(function() {
                    w.abort("timeout");
                }, m.timeout));
                try {
                    u = 1, k.send(s, d);
                } catch (x) {
                    if (!(2 > u)) throw x;
                    d(-1, x);
                }
            } else d(-1, "No Transport");
            return w;
        },
        getJSON: function(a, b, c) {
            return na.get(a, b, c, "json");
        },
        getScript: function(a, b) {
            return na.get(a, void 0, b, "script");
        }
    }), na.each([ "get", "post" ], function(a, b) {
        na[b] = function(a, c, d, e) {
            return na.isFunction(c) && (e = e || d, d = c, c = void 0), na.ajax(na.extend({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            }, na.isPlainObject(a) && a));
        };
    }), na._evalUrl = function(a) {
        return na.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        });
    }, na.fn.extend({
        wrapAll: function(a) {
            if (na.isFunction(a)) return this.each(function(b) {
                na(this).wrapAll(a.call(this, b));
            });
            if (this[0]) {
                var b = na(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; ) a = a.firstChild;
                    return a;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(a) {
            return na.isFunction(a) ? this.each(function(b) {
                na(this).wrapInner(a.call(this, b));
            }) : this.each(function() {
                var b = na(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a);
            });
        },
        wrap: function(a) {
            var b = na.isFunction(a);
            return this.each(function(c) {
                na(this).wrapAll(b ? a.call(this, c) : a);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                na.nodeName(this, "body") || na(this).replaceWith(this.childNodes);
            }).end();
        }
    }), na.expr.filters.hidden = function(a) {
        return la.reliableHiddenOffsets() ? a.offsetWidth <= 0 && a.offsetHeight <= 0 && !a.getClientRects().length : Z(a);
    }, na.expr.filters.visible = function(a) {
        return !na.expr.filters.hidden(a);
    };
    var bc = /%20/g, cc = /\[\]$/, dc = /\r?\n/g, ec = /^(?:submit|button|image|reset|file)$/i, fc = /^(?:input|select|textarea|keygen)/i;
    na.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = na.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
        };
        if (void 0 === b && (b = na.ajaxSettings && na.ajaxSettings.traditional), na.isArray(a) || a.jquery && !na.isPlainObject(a)) na.each(a, function() {
            e(this.name, this.value);
        }); else for (c in a) $(c, a[c], b, e);
        return d.join("&").replace(bc, "+");
    }, na.fn.extend({
        serialize: function() {
            return na.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var a = na.prop(this, "elements");
                return a ? na.makeArray(a) : this;
            }).filter(function() {
                var a = this.type;
                return this.name && !na(this).is(":disabled") && fc.test(this.nodeName) && !ec.test(a) && (this.checked || !Oa.test(a));
            }).map(function(a, b) {
                var c = na(this).val();
                return null == c ? null : na.isArray(c) ? na.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(dc, "\r\n")
                    };
                }) : {
                    name: b.name,
                    value: c.replace(dc, "\r\n")
                };
            }).get();
        }
    }), na.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return this.isLocal ? aa() : da.documentMode > 8 ? _() : /^(get|post|head|put|delete|options)$/i.test(this.type) && _() || aa();
    } : _;
    var gc = 0, hc = {}, ic = na.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in hc) hc[a](void 0, !0);
    }), la.cors = !!ic && "withCredentials" in ic, ic = la.ajax = !!ic, ic && na.ajaxTransport(function(b) {
        if (!b.crossDomain || la.cors) {
            var c;
            return {
                send: function(d, e) {
                    var f, g = b.xhr(), h = ++gc;
                    if (g.open(b.type, b.url, b.async, b.username, b.password), b.xhrFields) for (f in b.xhrFields) g[f] = b.xhrFields[f];
                    b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType), b.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                    for (f in d) void 0 !== d[f] && g.setRequestHeader(f, d[f] + "");
                    g.send(b.hasContent && b.data || null), c = function(a, d) {
                        var f, i, j;
                        if (c && (d || 4 === g.readyState)) if (delete hc[h], c = void 0, g.onreadystatechange = na.noop, 
                        d) 4 !== g.readyState && g.abort(); else {
                            j = {}, f = g.status, "string" == typeof g.responseText && (j.text = g.responseText);
                            try {
                                i = g.statusText;
                            } catch (k) {
                                i = "";
                            }
                            f || !b.isLocal || b.crossDomain ? 1223 === f && (f = 204) : f = j.text ? 200 : 404;
                        }
                        j && e(f, i, j, g.getAllResponseHeaders());
                    }, b.async ? 4 === g.readyState ? a.setTimeout(c) : g.onreadystatechange = hc[h] = c : c();
                },
                abort: function() {
                    c && c(void 0, !0);
                }
            };
        }
    }), na.ajaxPrefilter(function(a) {
        a.crossDomain && (a.contents.script = !1);
    }), na.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(a) {
                return na.globalEval(a), a;
            }
        }
    }), na.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
    }), na.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = da.head || na("head")[0] || da.documentElement;
            return {
                send: function(d, e) {
                    b = da.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), 
                    b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, 
                        b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"));
                    }, c.insertBefore(b, c.firstChild);
                },
                abort: function() {
                    b && b.onload(void 0, !0);
                }
            };
        }
    });
    var jc = [], kc = /(=)\?(?=&|$)|\?\?/;
    na.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = jc.pop() || na.expando + "_" + Ob++;
            return this[a] = !0, a;
        }
    }), na.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (kc.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && kc.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = na.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, 
        h ? b[h] = b[h].replace(kc, "$1" + e) : b.jsonp !== !1 && (b.url += (Pb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), 
        b.converters["script json"] = function() {
            return g || na.error(e + " was not called"), g[0];
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
            g = arguments;
        }, d.always(function() {
            void 0 === f ? na(a).removeProp(e) : a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, 
            jc.push(e)), g && na.isFunction(f) && f(g[0]), g = f = void 0;
        }), "script") : void 0;
    }), la.createHTMLDocument = function() {
        if (!da.implementation.createHTMLDocument) return !1;
        var a = da.implementation.createHTMLDocument("");
        return a.body.innerHTML = "<form></form><form></form>", 2 === a.body.childNodes.length;
    }(), na.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a) return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || (la.createHTMLDocument ? da.implementation.createHTMLDocument("") : da);
        var d = wa.exec(a), e = !c && [];
        return d ? [ b.createElement(d[1]) ] : (d = r([ a ], b, e), e && e.length && na(e).remove(), 
        na.merge([], d.childNodes));
    };
    var lc = na.fn.load;
    na.fn.load = function(a, b, c) {
        if ("string" != typeof a && lc) return lc.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h > -1 && (d = na.trim(a.slice(h, a.length)), a = a.slice(0, h)), na.isFunction(b) ? (c = b, 
        b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && na.ajax({
            url: a,
            type: e || "GET",
            dataType: "html",
            data: b
        }).done(function(a) {
            f = arguments, g.html(d ? na("<div>").append(na.parseHTML(a)).find(d) : a);
        }).always(c && function(a, b) {
            g.each(function() {
                c.apply(g, f || [ a.responseText, b, a ]);
            });
        }), this;
    }, na.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(a, b) {
        na.fn[b] = function(a) {
            return this.on(b, a);
        };
    }), na.expr.filters.animated = function(a) {
        return na.grep(na.timers, function(b) {
            return a === b.elem;
        }).length;
    }, na.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = na.css(a, "position"), l = na(a), m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = na.css(a, "top"), 
            i = na.css(a, "left"), j = ("absolute" === k || "fixed" === k) && na.inArray("auto", [ f, i ]) > -1, 
            j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), 
            na.isFunction(b) && (b = b.call(a, c, na.extend({}, h))), null != b.top && (m.top = b.top - h.top + g), 
            null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
        }
    }, na.fn.extend({
        offset: function(a) {
            if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                na.offset.setOffset(this, a, b);
            });
            var b, c, d = {
                top: 0,
                left: 0
            }, e = this[0], f = e && e.ownerDocument;
            return f ? (b = f.documentElement, na.contains(b, e) ? ("undefined" != typeof e.getBoundingClientRect && (d = e.getBoundingClientRect()), 
            c = ba(f), {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d) : void 0;
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                    top: 0,
                    left: 0
                }, d = this[0];
                return "fixed" === na.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), 
                b = this.offset(), na.nodeName(a[0], "html") || (c = a.offset()), c.top += na.css(a[0], "borderTopWidth", !0) - a.scrollTop(), 
                c.left += na.css(a[0], "borderLeftWidth", !0) - a.scrollLeft()), {
                    top: b.top - c.top - na.css(d, "marginTop", !0),
                    left: b.left - c.left - na.css(d, "marginLeft", !0)
                };
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent; a && !na.nodeName(a, "html") && "static" === na.css(a, "position"); ) a = a.offsetParent;
                return a || nb;
            });
        }
    }), na.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        na.fn[a] = function(d) {
            return Na(this, function(a, d, e) {
                var f = ba(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? na(f).scrollLeft() : e, c ? e : na(f).scrollTop()) : a[d] = e);
            }, a, d, arguments.length, null);
        };
    }), na.each([ "top", "left" ], function(a, b) {
        na.cssHooks[b] = F(la.pixelPosition, function(a, c) {
            return c ? (c = pb(a, b), lb.test(c) ? na(a).position()[b] + "px" : c) : void 0;
        });
    }), na.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        na.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            na.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                return Na(this, function(b, c, d) {
                    var e;
                    return na.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, 
                    Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? na.css(b, c, g) : na.style(b, c, d, g);
                }, b, f ? d : void 0, f, null);
            };
        });
    }), na.fn.extend({
        bind: function(a, b, c) {
            return this.on(a, null, b, c);
        },
        unbind: function(a, b) {
            return this.off(a, null, b);
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d);
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
        }
    }), na.fn.size = function() {
        return this.length;
    }, na.fn.andSelf = na.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return na;
    });
    var mc = a.jQuery, nc = a.$;
    return na.noConflict = function(b) {
        return a.$ === na && (a.$ = nc), b && a.jQuery === na && (a.jQuery = mc), na;
    }, b || (a.jQuery = a.$ = na), na;
}), function(a, b, c) {
    "function" == typeof define && define.amd ? define([ "jquery" ], function(d) {
        return c(d, a, b), d.mobile;
    }) : c(a.jQuery, a, b);
}(this, document, function(a, b, c, d) {
    !function(a, b, c, d) {
        function e(a) {
            for (;a && "undefined" != typeof a.originalEvent; ) a = a.originalEvent;
            return a;
        }
        function f(b, c) {
            var f, g, h, i, j, k, l, m, n, o = b.type;
            if (b = a.Event(b), b.type = c, f = b.originalEvent, g = a.event.props, o.search(/^(mouse|click)/) > -1 && (g = E), 
            f) for (l = g.length, i; l; ) i = g[--l], b[i] = f[i];
            if (o.search(/mouse(down|up)|click/) > -1 && !b.which && (b.which = 1), -1 !== o.search(/^touch/) && (h = e(f), 
            o = h.touches, j = h.changedTouches, k = o && o.length ? o[0] : j && j.length ? j[0] : d, 
            k)) for (m = 0, n = C.length; n > m; m++) i = C[m], b[i] = k[i];
            return b;
        }
        function g(b) {
            for (var c, d, e = {}; b; ) {
                c = a.data(b, z);
                for (d in c) c[d] && (e[d] = e.hasVirtualBinding = !0);
                b = b.parentNode;
            }
            return e;
        }
        function h(b, c) {
            for (var d; b; ) {
                if (d = a.data(b, z), d && (!c || d[c])) return b;
                b = b.parentNode;
            }
            return null;
        }
        function i() {
            M = !1;
        }
        function j() {
            M = !0;
        }
        function k() {
            Q = 0, K.length = 0, L = !1, j();
        }
        function l() {
            i();
        }
        function m() {
            n(), G = setTimeout(function() {
                G = 0, k();
            }, a.vmouse.resetTimerDuration);
        }
        function n() {
            G && (clearTimeout(G), G = 0);
        }
        function o(b, c, d) {
            var e;
            return (d && d[b] || !d && h(c.target, b)) && (e = f(c, b), a(c.target).trigger(e)), 
            e;
        }
        function p(b) {
            var c, d = a.data(b.target, A);
            !L && (!Q || Q !== d) && (c = o("v" + b.type, b), c && (c.isDefaultPrevented() && b.preventDefault(), 
            c.isPropagationStopped() && b.stopPropagation(), c.isImmediatePropagationStopped() && b.stopImmediatePropagation()));
        }
        function q(b) {
            var c, d, f, h = e(b).touches;
            h && 1 === h.length && (c = b.target, d = g(c), d.hasVirtualBinding && (Q = P++, 
            a.data(c, A, Q), n(), l(), J = !1, f = e(b).touches[0], H = f.pageX, I = f.pageY, 
            o("vmouseover", b, d), o("vmousedown", b, d)));
        }
        function r(a) {
            M || (J || o("vmousecancel", a, g(a.target)), J = !0, m());
        }
        function s(b) {
            if (!M) {
                var c = e(b).touches[0], d = J, f = a.vmouse.moveDistanceThreshold, h = g(b.target);
                J = J || Math.abs(c.pageX - H) > f || Math.abs(c.pageY - I) > f, J && !d && o("vmousecancel", b, h), 
                o("vmousemove", b, h), m();
            }
        }
        function t(a) {
            if (!M) {
                j();
                var b, c, d = g(a.target);
                o("vmouseup", a, d), J || (b = o("vclick", a, d), b && b.isDefaultPrevented() && (c = e(a).changedTouches[0], 
                K.push({
                    touchID: Q,
                    x: c.clientX,
                    y: c.clientY
                }), L = !0)), o("vmouseout", a, d), J = !1, m();
            }
        }
        function u(b) {
            var c, d = a.data(b, z);
            if (d) for (c in d) if (d[c]) return !0;
            return !1;
        }
        function v() {}
        function w(b) {
            var c = b.substr(1);
            return {
                setup: function() {
                    u(this) || a.data(this, z, {});
                    var d = a.data(this, z);
                    d[b] = !0, F[b] = (F[b] || 0) + 1, 1 === F[b] && O.bind(c, p), a(this).bind(c, v), 
                    N && (F.touchstart = (F.touchstart || 0) + 1, 1 === F.touchstart && O.bind("touchstart", q).bind("touchend", t).bind("touchmove", s).bind("scroll", r));
                },
                teardown: function() {
                    --F[b], F[b] || O.unbind(c, p), N && (--F.touchstart, F.touchstart || O.unbind("touchstart", q).unbind("touchmove", s).unbind("touchend", t).unbind("scroll", r));
                    var d = a(this), e = a.data(this, z);
                    e && (e[b] = !1), d.unbind(c, v), u(this) || d.removeData(z);
                }
            };
        }
        var x, y, z = "virtualMouseBindings", A = "virtualTouchID", B = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), C = "clientX clientY pageX pageY screenX screenY".split(" "), D = a.event.mouseHooks ? a.event.mouseHooks.props : [], E = a.event.props.concat(D), F = {}, G = 0, H = 0, I = 0, J = !1, K = [], L = !1, M = !1, N = "addEventListener" in c, O = a(c), P = 1, Q = 0;
        for (a.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        }, y = 0; y < B.length; y++) a.event.special[B[y]] = w(B[y]);
        N && c.addEventListener("click", function(b) {
            var c, d, e, f, g, h, i = K.length, j = b.target;
            if (i) for (c = b.clientX, d = b.clientY, x = a.vmouse.clickDistanceThreshold, e = j; e; ) {
                for (f = 0; i > f; f++) if (g = K[f], h = 0, e === j && Math.abs(g.x - c) < x && Math.abs(g.y - d) < x || a.data(e, A) === g.touchID) return b.preventDefault(), 
                void b.stopPropagation();
                e = e.parentNode;
            }
        }, !0);
    }(a, b, c), function(a) {
        a.mobile = {};
    }(a), function(a, b) {
        var d = {
            touch: "ontouchend" in c
        };
        a.mobile.support = a.mobile.support || {}, a.extend(a.support, d), a.extend(a.mobile.support, d);
    }(a), function(a, b, d) {
        function e(b, c, e, f) {
            var g = e.type;
            e.type = c, f ? a.event.trigger(e, d, b) : a.event.dispatch.call(b, e), e.type = g;
        }
        var f = a(c), g = a.mobile.support.touch, h = "touchmove scroll", i = g ? "touchstart" : "mousedown", j = g ? "touchend" : "mouseup", k = g ? "touchmove" : "mousemove";
        a.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(b, c) {
            a.fn[c] = function(a) {
                return a ? this.bind(c, a) : this.trigger(c);
            }, a.attrFn && (a.attrFn[c] = !0);
        }), a.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                function b(a, b) {
                    c = b, e(f, c ? "scrollstart" : "scrollstop", a);
                }
                var c, d, f = this, g = a(f);
                g.bind(h, function(e) {
                    a.event.special.scrollstart.enabled && (c || b(e, !0), clearTimeout(d), d = setTimeout(function() {
                        b(e, !1);
                    }, 50));
                });
            },
            teardown: function() {
                a(this).unbind(h);
            }
        }, a.event.special.tap = {
            tapholdThreshold: 750,
            emitTapOnTaphold: !0,
            setup: function() {
                var b = this, c = a(b), d = !1;
                c.bind("vmousedown", function(g) {
                    function h() {
                        clearTimeout(k);
                    }
                    function i() {
                        h(), c.unbind("vclick", j).unbind("vmouseup", h), f.unbind("vmousecancel", i);
                    }
                    function j(a) {
                        i(), d || l !== a.target ? d && a.preventDefault() : e(b, "tap", a);
                    }
                    if (d = !1, g.which && 1 !== g.which) return !1;
                    var k, l = g.target;
                    c.bind("vmouseup", h).bind("vclick", j), f.bind("vmousecancel", i), k = setTimeout(function() {
                        a.event.special.tap.emitTapOnTaphold || (d = !0), e(b, "taphold", a.Event("taphold", {
                            target: l
                        }));
                    }, a.event.special.tap.tapholdThreshold);
                });
            },
            teardown: function() {
                a(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"), f.unbind("vmousecancel");
            }
        }, a.event.special.swipe = {
            scrollSupressionThreshold: 30,
            durationThreshold: 1e3,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 30,
            getLocation: function(a) {
                var c = b.pageXOffset, d = b.pageYOffset, e = a.clientX, f = a.clientY;
                return 0 === a.pageY && Math.floor(f) > Math.floor(a.pageY) || 0 === a.pageX && Math.floor(e) > Math.floor(a.pageX) ? (e -= c, 
                f -= d) : (f < a.pageY - d || e < a.pageX - c) && (e = a.pageX - c, f = a.pageY - d), 
                {
                    x: e,
                    y: f
                };
            },
            start: function(b) {
                var c = b.originalEvent.touches ? b.originalEvent.touches[0] : b, d = a.event.special.swipe.getLocation(c);
                return {
                    time: new Date().getTime(),
                    coords: [ d.x, d.y ],
                    origin: a(b.target)
                };
            },
            stop: function(b) {
                var c = b.originalEvent.touches ? b.originalEvent.touches[0] : b, d = a.event.special.swipe.getLocation(c);
                return {
                    time: new Date().getTime(),
                    coords: [ d.x, d.y ]
                };
            },
            handleSwipe: function(b, c, d, f) {
                if (c.time - b.time < a.event.special.swipe.durationThreshold && Math.abs(b.coords[0] - c.coords[0]) > a.event.special.swipe.horizontalDistanceThreshold && Math.abs(b.coords[1] - c.coords[1]) < a.event.special.swipe.verticalDistanceThreshold) {
                    var g = b.coords[0] > c.coords[0] ? "swipeleft" : "swiperight";
                    return e(d, "swipe", a.Event("swipe", {
                        target: f,
                        swipestart: b,
                        swipestop: c
                    }), !0), e(d, g, a.Event(g, {
                        target: f,
                        swipestart: b,
                        swipestop: c
                    }), !0), !0;
                }
                return !1;
            },
            eventInProgress: !1,
            setup: function() {
                var b, c = this, d = a(c), e = {};
                b = a.data(this, "mobile-events"), b || (b = {
                    length: 0
                }, a.data(this, "mobile-events", b)), b.length++, b.swipe = e, e.start = function(b) {
                    if (!a.event.special.swipe.eventInProgress) {
                        a.event.special.swipe.eventInProgress = !0;
                        var d, g = a.event.special.swipe.start(b), h = b.target, i = !1;
                        e.move = function(b) {
                            g && !b.isDefaultPrevented() && (d = a.event.special.swipe.stop(b), i || (i = a.event.special.swipe.handleSwipe(g, d, c, h), 
                            i && (a.event.special.swipe.eventInProgress = !1)), Math.abs(g.coords[0] - d.coords[0]) > a.event.special.swipe.scrollSupressionThreshold && b.preventDefault());
                        }, e.stop = function() {
                            i = !0, a.event.special.swipe.eventInProgress = !1, f.off(k, e.move), e.move = null;
                        }, f.on(k, e.move).one(j, e.stop);
                    }
                }, d.on(i, e.start);
            },
            teardown: function() {
                var b, c;
                b = a.data(this, "mobile-events"), b && (c = b.swipe, delete b.swipe, b.length--, 
                0 === b.length && a.removeData(this, "mobile-events")), c && (c.start && a(this).off(i, c.start), 
                c.move && f.off(k, c.move), c.stop && f.off(j, c.stop));
            }
        }, a.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe.left",
            swiperight: "swipe.right"
        }, function(b, c) {
            a.event.special[b] = {
                setup: function() {
                    a(this).bind(c, a.noop);
                },
                teardown: function() {
                    a(this).unbind(c);
                }
            };
        });
    }(a, this);
}), $(document).ready(function() {
    function a() {
        var a = $(".luzonCaramelPercent").text().replace(/[a-z]\s/, ""), b = $(".luzonChocoPercent").text().replace(/[a-z]\s/, ""), c = $(".visayasCaramelPercent").text().replace(/[a-z]\s/, ""), d = $(".visayasChocoPercent").text().replace(/[a-z]\s/, ""), e = $(".mindanaoCaramelPercent").text().replace(/[a-z]\s/, ""), f = $(".mindanaoChocoPercent").text().replace(/[a-z]\s/, "");
        $(".luzonCaramelVotes").css({
            width: a
        }), $(".luzonChocoVotes").css({
            width: b
        }), $(".visayasCaramelVotes").css({
            width: c
        }), $(".visayasChocoVotes").css({
            width: d
        }), $(".mindanaoCaramelVotes").css({
            width: e
        }), $(".mindanaoChocoVotes").css({
            width: f
        });
    }
    a();
}), $(document).ready(function() {
    function a() {
        var a = $(".luzonCaramelPercentLabel").text().replace(/[a-z]\s/, ""), b = $(".visayasCaramelPercentLabel").text().replace(/[a-z]\s/, ""), c = $(".mindanaoCaramelPercentLabel").text().replace(/[a-z]\s/, "");
        $(".luzonCaramelPercentBar").css({
            width: a
        }), $(".visayasCaramelPercentBar").css({
            width: b
        }), $(".mindanaoCaramelPercentBar").css({
            width: c
        });
    }
    a();
}), $(document).ready(function() {
    function a() {
        $(".luzonBtn, .visayasBtn, .mindanaoBtn").removeClass("active");
    }
    $(".luzonBtn").click(function() {
        a(), $(".luzonBtn").addClass("active");
    }), $(".visayasBtn").click(function() {
        a(), $(".visayasBtn").addClass("active");
    }), $(".mindanaoBtn").click(function() {
        a(), $(".mindanaoBtn").addClass("active");
    });
}), $(document).ready(function() {
    function a() {
        $(".luzonBtn, .visayasBtn, .mindanaoBtn").removeClass("active");
    }
    function b() {
        $(".locationPage .voteSquareBtn").removeClass("buttonDisable");
    }
    $(".locationPage .voteSquareBtn").addClass("buttonDisable"), $(".luzonBtn").click(function() {
        a(), b(), $(".luzonBtn").addClass("active");
    }), $(".visayasBtn").click(function() {
        a(), b(), $(".visayasBtn").addClass("active");
    }), $(".mindanaoBtn").click(function() {
        a(), b(), $(".mindanaoBtn").addClass("active");
    });
}), $(document).ready(function() {
    $(".menuBtn").click(function() {
        $(".mainNav").animate({
            height: "toggle"
        }, 300);
    }), $(window).resize(function() {
        $(".mainNav").css({
            display: ""
        });
    });
}), !function(a, b, c) {
    function d(a, b) {
        return typeof a === b;
    }
    function e() {
        var a, b, c, e, f, g, h;
        for (var i in k) if (k.hasOwnProperty(i)) {
            if (a = [], b = k[i], b.name && (a.push(b.name.toLowerCase()), b.options && b.options.aliases && b.options.aliases.length)) for (c = 0; c < b.options.aliases.length; c++) a.push(b.options.aliases[c].toLowerCase());
            for (e = d(b.fn, "function") ? b.fn() : b.fn, f = 0; f < a.length; f++) g = a[f], 
            h = g.split("."), 1 === h.length ? m[h[0]] = e : (!m[h[0]] || m[h[0]] instanceof Boolean || (m[h[0]] = new Boolean(m[h[0]])), 
            m[h[0]][h[1]] = e), j.push((e ? "" : "no-") + h.join("-"));
        }
    }
    function f(a) {
        var b = n.className, c = m._config.classPrefix || "";
        if (o && (b = b.baseVal), m._config.enableJSClass) {
            var d = new RegExp("(^|\\s)" + c + "no-js(\\s|$)");
            b = b.replace(d, "$1" + c + "js$2");
        }
        m._config.enableClasses && (b += " " + c + a.join(" " + c), o ? n.className.baseVal = b : n.className = b);
    }
    function g() {
        return "function" != typeof b.createElement ? b.createElement(arguments[0]) : o ? b.createElementNS.call(b, "http://www.w3.org/2000/svg", arguments[0]) : b.createElement.apply(b, arguments);
    }
    function h() {
        var a = b.body;
        return a || (a = g(o ? "svg" : "body"), a.fake = !0), a;
    }
    function i(a, c, d, e) {
        var f, i, j, k, l = "modernizr", m = g("div"), o = h();
        if (parseInt(d, 10)) for (;d--; ) j = g("div"), j.id = e ? e[d] : l + (d + 1), m.appendChild(j);
        return f = g("style"), f.type = "text/css", f.id = "s" + l, (o.fake ? o : m).appendChild(f), 
        o.appendChild(m), f.styleSheet ? f.styleSheet.cssText = a : f.appendChild(b.createTextNode(a)), 
        m.id = l, o.fake && (o.style.background = "", o.style.overflow = "hidden", k = n.style.overflow, 
        n.style.overflow = "hidden", n.appendChild(o)), i = c(m, a), o.fake ? (o.parentNode.removeChild(o), 
        n.style.overflow = k, n.offsetHeight) : m.parentNode.removeChild(m), !!i;
    }
    var j = [], k = [], l = {
        _version: "3.3.1",
        _config: {
            classPrefix: "",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0
        },
        _q: [],
        on: function(a, b) {
            var c = this;
            setTimeout(function() {
                b(c[a]);
            }, 0);
        },
        addTest: function(a, b, c) {
            k.push({
                name: a,
                fn: b,
                options: c
            });
        },
        addAsyncTest: function(a) {
            k.push({
                name: null,
                fn: a
            });
        }
    }, m = function() {};
    m.prototype = l, m = new m();
    var n = b.documentElement, o = "svg" === n.nodeName.toLowerCase(), p = l._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [ "", "" ];
    l._prefixes = p;
    var q = l.testStyles = i;
    m.addTest("touchevents", function() {
        var c;
        if ("ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch) c = !0; else {
            var d = [ "@media (", p.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}" ].join("");
            q(d, function(a) {
                c = 9 === a.offsetTop;
            });
        }
        return c;
    }), e(), f(j), delete l.addTest, delete l.addAsyncTest;
    for (var r = 0; r < m._q.length; r++) m._q[r]();
    a.Modernizr = m;
}(window, document), $(document).ready(function() {
    function a() {
        $(".swipeWrap").removeClass("swipeSelectCaramel"), $(".swipeWrap").removeClass("active-caramel"), 
        $(".swipeWrap").addClass("swipeSelectChoco"), $(".swipeWrap").addClass("active-choco"), 
        $(".chocoHolder").css({
            opacity: "1",
            transform: "scale(1)"
        }), $(".caramelHolder").css({
            opacity: "0.5",
            transform: "scale(0.6)"
        }), $(".chocolate-header").addClass("animated fadeInUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            $(".chocolate-txt1, .chocolate-txt2, .chocolate-txt3, .chocolate-txt4").addClass("animated bounceIn");
        }), $(".caramel-header").removeClass("animated fadeInUp"), $(".caramel-txt1, .caramel-txt2, .caramel-txt3, .caramel-txt4").removeClass("animated bounceIn"), 
        $(".voteSquareBtn").data("data-id", 2);
    }
    function b() {
        $(".swipeWrap").removeClass("swipeSelectChoco"), $(".swipeWrap").removeClass("active-choco"), 
        $(".swipeWrap").addClass("swipeSelectCaramel"), $(".swipeWrap").addClass("active-caramel"), 
        $(".caramelHolder").css({
            opacity: "1",
            transform: "scale(1)"
        }), $(".chocoHolder").css({
            opacity: "0.5",
            transform: "scale(0.6)"
        }), $(".caramel-header").addClass("animated fadeInUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            $(".caramel-txt1, .caramel-txt2, .caramel-txt3, .caramel-txt4").addClass("animated bounceIn");
        }), $(".chocolate-header").removeClass("animated fadeInUp"), $(".chocolate-txt1, .chocolate-txt2, .chocolate-txt3, .chocolate-txt4").removeClass("animated bounceIn"), 
        $(".voteSquareBtn").data("data-id", 1);
    }
    function c() {
        $(".votePage .voteSquareBtn").removeClass("buttonDisable");
    }
    $(".votePage .voteSquareBtn").addClass("buttonDisable"), $(".touchevents .caramelHolder").click(function() {
        b(), c();
    }), $(".touchevents .chocoHolder").click(function() {
        a(), c();
    }), $(".touchevents .votePage").on("swipeleft", function() {
        a(), c();
    }), $(".touchevents .votePage").on("swiperight", function() {
        b(), c();
    }), $(".no-touchevents .caramelHolder").on("mouseenter", function() {
        b(), c();
    }), $(".no-touchevents .chocoHolder").on("mouseenter", function() {
        a(), c();
    });
}), $(document).ready(function() {
    function a() {
        $(".winnerContainer, .msgWrap").removeClass("luzon"), $(".winnerContainer, .msgWrap").removeClass("visayas"), 
        $(".winnerContainer, .msgWrap").removeClass("mindanao");
    }
    var b = 1;
    $(".rightArrow").click(function() {
        b += 1, 1 == b && (a(), $(".winnerContainer, .msgWrap").addClass("luzon")), 2 == b && (a(), 
        $(".winnerContainer, .msgWrap").addClass("visayas")), 3 == b && (a(), $(".winnerContainer, .msgWrap").addClass("mindanao")), 
        b >= 4 && (a(), $(".winnerContainer, .msgWrap").addClass("luzon"), b = 1);
    }), $(".leftArrow").click(function() {
        b -= 1, 1 > b && (a(), $(".winnerContainer, .msgWrap").addClass("mindanao"), b = 3), 
        1 == b && (a(), $(".winnerContainer, .msgWrap").addClass("luzon")), 2 == b && (a(), 
        $(".winnerContainer, .msgWrap").addClass("visayas")), 3 == b && (a(), $(".winnerContainer, .msgWrap").addClass("mindanao"));
    }), $(".winner").on("swipeleft", function() {
        b += 1, 1 == b && (a(), $(".winnerContainer, .msgWrap").addClass("luzon")), 2 == b && (a(), 
        $(".winnerContainer, .msgWrap").addClass("visayas")), 3 == b && (a(), $(".winnerContainer, .msgWrap").addClass("mindanao")), 
        b >= 4 && (b = 3);
    }), $(".winner").on("swiperight", function() {
        b -= 1, 1 > b && (b = 1), 1 == b && (a(), $(".winnerContainer, .msgWrap").addClass("luzon")), 
        2 == b && (a(), $(".winnerContainer, .msgWrap").addClass("visayas")), 3 == b && (a(), 
        $(".winnerContainer, .msgWrap").addClass("mindanao"));
    }), $(window).resize(function() {
        a();
    });
});