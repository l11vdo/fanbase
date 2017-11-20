
app.controller('mainCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $sce, $timeout, $window) {

    $rootScope.currentProcess = '';
    $scope.person = { fb_email: '', fb_name: '', fb_photo: '' };
    $scope.checkSave = '';

    $scope.trackIndex = -1;
    $rootScope.footerButton = { back: 'N', home: 'N', save: 'N', radio: 'Y', search: 'Y' };
    $scope.performerSearch = "";

    $rootScope.fb_bannerTitle = '';
    $scope.setBannerTitle = function (title) {
        $rootScope.fb_bannerTitle = title;
    }

    $scope.performerName = function () { return keyData.get('performerName'); }

    $scope.profile_name = function () { return keyData.get('fb_name'); }

    $scope.doLogin = function (fb_person) {
        Data.post('login', {
            fb_person: fb_person
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                keyData.post('fb_id', results.fb_id);
                keyData.set('fb_email', results.fb_email);
                keyData.set('fb_name', results.fb_name);
                keyData.set('fb_profile_photo', results.fb_photo);
                $scope.setCurrentForm('partials/newsfeed.html');

                $location.path('home');
            }
        });
    };

    $scope.isLoggedOn = function () { return keyData.check('fb_id'); }

    $rootScope.logout = function () {
        Data.get('logout');
        Data.toast({ status: 'success', message: 'logged out succesfully' });
        keyData.clear();
    };

    $rootScope.login = function () {
        $scope.setBannerTitle("Fanbase Login");
        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    };

    $scope.get = function () {
        Data.get('homePage').then(function (results) {
            //            Data.toast(results);
            if (results.status == "success") {
                $scope.person = results.fb_person;
                $scope.email_status = 'verified';
            }
        })
    };

    $scope.$watch('currentProcess', function () {
        if ($rootScope.currentProcess == "performer") {
            $scope.navigation = [
                { title: 'Cover photo', templateUrl: 'partials/photo.html', buttonlabel: 'Cover Photo', glyph: 'fa-file-photo-o', controller: 'photoCntrl', loadStatus: '', html: '', get: 'getphoto', auth: 'Y' },
                { title: 'Performer details', templateUrl: 'partials/performerDetails.html', buttonlabel: 'Performer Details', glyph: 'fa-list', controller: 'perfdetailsCntrl', loadStatus: '', html: '', get: 'getPerformerDetail', auth: 'Y' },
                { title: 'Location(s)', templateUrl: 'partials/perf_location.html', buttonlabel: 'Location(s)', glyph: 'fa-globe', controller: 'locationCntrl', loadStatus: '', html: '', get: 'getPerfLocations', auth: 'Y' },
                { title: 'Media links', templateUrl: 'partials/weblinks.html', buttonlabel: 'Media Links', glyph: 'fa-external-link', controller: 'weblinkCntrl', loadStatus: '', html: '', get: 'getWeblinkList', auth: 'Y' },
                { title: 'Radio Tracks', templateUrl: 'partials/track.html', buttonlabel: 'Radio Tracks', glyph: 'fa-music', controller: 'trackCntrl', loadStatus: '', html: '', get: 'getTrackList', auth: 'Y' },
                { title: 'Members', templateUrl: 'partials/members.html', buttonlabel: 'Members', glyph: 'fa-user-plus', controller: 'membersCntrl', loadStatus: '', html: '', get: 'getMemberList', auth: 'Y' }];

            $scope.setBackPage('partials/performer.html');
            $scope.setCurrentForm('partials/performer.html');
        }

        if ($rootScope.currentProcess == "profile") {
            $scope.navigation = [
                { title: 'Security profile', templateUrl: 'partials/security.html', buttonlabel: 'Security', glyph: 'fa-lock', controller: 'securityCntrl', loadStatus: '', html: '', get: 'getSecurity', auth: 'N' },
                { title: 'Identity details', templateUrl: 'partials/identity.html', buttonlabel: 'Identity', glyph: 'fa-user', controller: 'identityCntrl', loadStatus: '', html: '', get: 'getIdentity', auth: 'Y' },
                { title: 'Address details', templateUrl: 'partials/address.html', buttonlabel: 'Address', glyph: 'fa-home', controller: 'addrCntrl', loadStatus: '', html: '', get: 'getaddress', auth: 'Y' },
                { title: 'Profile photo', templateUrl: 'partials/photo.html', buttonlabel: 'Photo', glyph: 'fa-camera', controller: 'photoCntrl', loadStatus: '', html: '', get: 'getphoto', auth: 'Y' },
                { title: 'Location(s)', templateUrl: 'partials/pers_location.html', buttonlabel: 'Location(s)', glyph: 'fa-globe', controller: 'locationCntrl', loadStatus: '', html: '', get: 'getPersLocations', auth: 'Y' },
                { title: 'Contact methods', templateUrl: 'partials/contact.html', buttonlabel: 'Contact', glyph: 'fa-phone', controller: 'contactCntrl', loadStatus: '', html: '', get: 'getContactList', auth: 'Y' }];

            $scope.setCurrentForm('partials/profile.html');
            $scope.setBackPage('partials/profile.html');
        }

        if ($rootScope.currentProcess == "signup") {
            $scope.navigation = [
                { title: 'Security profile', templateUrl: 'partials/security.html', buttonlabel: 'Security', glyph: 'fa-lock', controller: 'securityCntrl', loadStatus: '', html: '', get: 'getSecurity', auth: 'N' },
                { title: 'Identity details', templateUrl: 'partials/identity.html', buttonlabel: 'Identity', glyph: 'fa-user', controller: 'identityCntrl', loadStatus: '', html: '', get: 'getIdentity', auth: 'Y' },
                { title: 'Address details', templateUrl: 'partials/address.html', buttonlabel: 'Address', glyph: 'fa-home', controller: 'addrCntrl', loadStatus: '', html: '', get: 'getaddress', auth: 'Y' },
                { title: 'Profile photo', templateUrl: 'partials/photo.html', buttonlabel: 'Photo', glyph: 'fa-camera', controller: 'photoCntrl', loadStatus: '', html: '', get: 'getphoto', auth: 'Y' },
                { title: 'Location(s)', templateUrl: 'partials/pers_location.html', buttonlabel: 'Location(s)', glyph: 'fa-globe', controller: 'locationCntrl', loadStatus: '', html: '', get: 'getPersLocations', auth: 'Y' },
                { title: 'Contact methods', templateUrl: 'partials/contact.html', buttonlabel: 'Contact', glyph: 'fa-phone', controller: 'contactCntrl', loadStatus: '', html: '', get: 'getContactList', auth: 'Y' }];

            $scope.setCurrentForm('partials/profile.html');
            $scope.setBackPage('partials/profile.html');
        }
    });

    $scope.setFooterButton = function (buttonSet) {
        $rootScope.footerButton = JSON.parse(JSON.stringify(buttonSet));
    }
    $scope.setCompletion = function () {
        for (i = 0; i < $scope.navigation.length; i++) { $scope.checkCompleted(i); }
        if ($rootScope.currentProcess == "performer") {
            $scope.setBackPage('partials/performer.html');
        }
    }

    $scope.checkCompleted = function (index) {
        $scope.navigation[index].html = $sce.trustAsHtml("<i class='fa fa-lg text-danger fa-thumbs-o-down'></i>");
        $scope.navigation[index].loadStatus = 'N';
        if (keyData.get('fb_id') > 0) {
            Data.get($scope.navigation[index].get).then(function (results) {
                if (results.status == "success") {
                    $scope.navigation[index].html = $sce.trustAsHtml("<i class='fa fa-lg text-success fa-thumbs-o-up'></i>");
                    $scope.navigation[index].loadStatus = 'Y';
                }
            });
        }
    }

    $scope.setPartial = function (index) {
        if (index < 0) {
            if ($scope.getCurrentForm().indexOf("performerMenu") >= 0) $scope.setBackPage("partials/performer.html");
            $scope.setCurrentForm($scope.getBackPage());
        }
        else {
            $scope.setCurrentForm($scope.navigation[index].templateUrl);
        }
    }

    $scope.getPartial = function () {
        return $scope.getCurrentForm();
    }

    $scope.back = function () {
        $rootScope.fb_transition = 'slide-right';
        $scope.setCurrentForm($scope.getBackPage());

        $timeout(function () { $rootScope.fb_transition = 'slide-left'; }, 1000);
    };

    $scope.init = function () {
        keyData.load("fb_id");
        keyData.remove('performer_id');
        $rootScope.fb_transition = 'slide-left';
        $rootScope.currentProcess = '';
    }

    $scope.initHome = function () {
        $scope.init();
        $scope.setCurrentForm("partials/newsfeed.html");
    }

    $scope.initRadio = function () {
        $scope.init();
        $scope.setCurrentForm("partials/radioplayer.html");
    }

    $scope.home = function () {
        if (window.location.href.indexOf("/home") >= 0) $window.location.reload();
        else {
            $location.path("/home");
        }
    }

    $scope.initSearch = function () {
        $scope.init();
        $scope.setCurrentForm("partials/searchPerformers.html");
    }

    $scope.radio = function () {
        $scope.init();
        $rootScope.loading = true;
        if (window.location.href.indexOf("/radio") >= 0) $window.location.reload();
        else $location.path("/radio");
    }

    $scope.search = function () {
        $scope.init();
        $location.path("/search");
    }

    $scope.save = function () {
        $rootScope.$emit('save');
    }

    $scope.checkSave = function (q) {
        return q == 'N';
    }

    $rootScope.currentProcess = '';

    $scope.setCurrentProcess = function (pg) {
        $rootScope.currentProcess = pg;
    }
    $scope.getCurrentProcess = function (prc) {
        return $rootScope.currentProcess;
    }
    $scope.setCurrentForm = function (pg) {
        $rootScope.currentForm = pg;
    }
    $scope.getCurrentForm = function (prc) {
        return $rootScope.currentForm;
    }

    $scope.setBackPage = function (pg) {
        $rootScope.backPage = pg;
    }
    $scope.getBackPage = function () {
        return $rootScope.backPage;
    }

    $rootScope.showSidebar = function () {
        if (window.location.href.indexOf("/login") >= 0 || window.location.href.indexOf("/signup") >= 0) {
            return false;
        } else {
            return true;
        }
    };

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        if (window.location.href.indexOf("/radio") <= 0) $rootScope.loading = false;
    });

    screen.orientation.lock('portrait');

    $scope.getBase64Image = function (photo) {
        var canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        var img = new Image();
        img.onload = function () {
            var ctx = canvas.getContext('2d');
            var scaled = $scope.calculateAspectRatioFit(this.width, this.height, canvas.width, canvas.height);
            ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, scaled.width, scaled.height);
            keyData.set("base64", canvas.toDataURL("image/jpeg"));
        }
        img.src = photo;
    }

    $scope.calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth * ratio, height: srcHeight * ratio };
    }

});

app.controller('profileCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $sce, $timeout, $window) {

    $scope.initProfile = function () {

        $scope.setBannerTitle("Fanbase Profile");

        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
        $scope.setCurrentProcess('profile');
        keyData.remove('performer_id');
        keyData.set('photo_type', 'Profile');
        $scope.getBase64Image(keyData.get("fb_profile_photo"));
        $scope.verify_step = '';

        $scope.setCompletion();
    }

    $scope.securityLoaded = function () {
        return (keyData.get("fb_id") > 0);
    }

    $scope.setPersPartial = function (index) {
        $scope.setBackPage('partials/profile.html');
        $scope.setCurrentForm($scope.navigation[index].templateUrl);
    }
});

app.controller('newsfeedCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $sce, $timeout, $window) {
    $scope.fb_newsfeed = [];

    $scope.getNews = function () {
        $scope.setBannerTitle("Fanbase News");
        $rootScope.loading = true;
        Data.get('getNewsFeed').then(function (results) {
            $scope.fb_newsfeed = results.fb_newsfeed;
            if ($scope.fb_newsfeed.length > 0) {
                $scope.fb_newsdate = $scope.fb_newsfeed[0].fb_created_dt;
                $rootScope.loading = false;
            }
            $scope.setFooterButton({ back: 'N', home: 'N', save: 'N', radio: 'Y', search: 'Y' });
        })
    };

    $scope.showSummary = function (index) {

        keyData.post("performer_id", $scope.fb_newsfeed[index].fb_performer_id);
        keyData.set("performerName", $scope.fb_newsfeed[index].fb_name);
        keyData.set("fb_performer_photo", $scope.fb_newsfeed[index].fb_photo);

        $scope.setCurrentForm("partials/performerSummary.html");
    }

    $scope.buttonPlay = function (index) {
        for (i = 0; i < $scope.fb_newsfeed.length; i++) {
            if ($scope.fb_newsfeed[i].trackPlaying) {
                $scope.track.stop();
            }
        }
        $("#prog" + index).css('width', '0');
        var url = $scope.fb_newsfeed[index].fb_track_url;
        $scope.track = soundManager.createSound({
            id: 'mySound' + index,
            url: url,
            whileplaying: function () {
                $("#prog" + index).css('width', ((this.position / this.duration) * 100) + '%');
            },
            onfinish: function () {
                $("#prog" + index).css('width', '0');
                $scope.fb_newsfeed[index].trackPlaying = false;
            },
            onstop: function () {
                $("#prog" + index).css('width', '0');
                $scope.fb_newsfeed[index].trackPlaying = false;
            }
        });
        $timeout(function () { $scope.track.play(); }, 1000);

        $scope.fb_newsfeed[index].trackPlaying = true;
    };

    $scope.buttonStop = function (index) {
        $scope.fb_newsfeed[index].trackPlaying = false;
        $("#prog" + index).css('width', '0');
        $scope.track.stop();
    };
    $scope.openMediaLink = function (index) {
        $window.open($scope.fb_newsfeed[index].fb_link);
    }

});

app.controller('signupCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $sce) {
    $scope.setBannerTitle("Fanbase Sign-Up");
    keyData.set('fb_name', 'New Member');
    keyData.set('idMode', 'signup');
    $scope.original_pwd = '';
    $scope.signup = { fb_email: '', fb_validation_code: '', fb_pwd: '', fb_pwd2: '', orig_pwd: '' };
    $scope.passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    if (!$rootScope.fb_transition) $rootScope.fb_transition = 'slide-left';

    $scope.init = function () {
        $scope.verify_step = 'initiate';
        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    }

    $scope.verify = function () {
        $scope.email_status = 'unverified';
        $rootScope.loading = true;
        Data.post('verifyEmail', {
            fb_security: $scope.signup
        }).then(function (results) {
            Data.toast(results);
            $rootScope.loading = false;
            if (results.status == "success") {
                $scope.verify_step = 'validate';
            }
        })
    };

    $scope.validate = function () {
        $rootScope.loading = true;
        Data.post('validateEmail', {
            fb_security: $scope.signup
        }).then(function (results) {
            Data.toast(results);
            $rootScope.loading = false;
            if (results.status == "success") {
                $scope.email_status = 'verified';
                $scope.original_email = $scope.signup.fb_email;
                $scope.signup.fb_validation_code = '';
                $scope.verify_step = 'password';
            }
        })
    };

    $scope.save = function () {
        Data.post('saveSecurity', {
            fb_security: $scope.signup
        }).then(function (results) {
            if (results.status == "success") {
                Data.toast(results);
                keyData.post("fb_id", results.fb_id);
                keyData.set("fb_email", $scope.signup.fb_email);
                if (results.fb_name != '') keyData.set("fb_name", results.fb_name);
                $scope.idForm = "partials/identity.html";
                keyData.set('idMode', 'identity');
                $scope.verify_step = 'identity';
            }
        });
    };
});

app.controller('addrCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    $scope.addressForm = "findAddress";
    $scope.address = { fb_house_nr: '', fb_street: '', fb_city: '', fb_postcode: '', fb_county: '', fb_country: '', fb_formatted: '' };
    $scope.streetList = "";

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });

    $scope.init = function () {
        $scope.$watch('editAddressForm.$valid', function (validity) {
            if (validity) $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
            else $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });;
        });
    }

    $scope.setStreet = function (streetName) {
        $scope.address['fb_street'] = streetName;
        $scope.addressForm = "editAddress";
        $scope.streetList = "";
    }

    $scope.seek = function (fb_address) {
        Data.post('findAddress', {
            fb_address: fb_address
        }).then(function (results) {

            if (results.status == "success") {

                $scope.address['fb_house_nr'] = results.fb_house_nr;
                $scope.address['fb_street'] = results.fb_street;
                $scope.address['fb_city'] = results.fb_city;
                $scope.address['fb_postcode'] = results.fb_postcode;
                $scope.address['fb_county'] = results.fb_county;
                $scope.address['fb_country'] = results.fb_country;
                $scope.address['fb_formatted'] = results.fb_formatted;

                var i = 0;
                if (results['streets'][1]) {
                    var tbl = "<table><th>Which street?</th>";
                    while (results['streets'][i]) {
                        tbl += "<tr><td><a ng-click='setStreet(\"" + results['streets'][i] + "\")'>" + results['streets'][i++] + "</a></td></tr>";
                    }
                    tbl += "</table>";
                    $scope.streetList = tbl;
                } else {
                    $scope.addressForm = "editAddress";
                }
            } else {
                Data.toast(results);
            }
        });
    };

    $scope.switch = function (fb_address) {
        if ($scope.addressForm == "editAddress") {
            $scope.addressForm = "findAddress";
        }
        else {
            $scope.addressForm = "editAddress";
        }
    };

    $scope.save = function () {
        Data.post('saveAddress', {
            fb_address: $scope.address
        }).then(function (results) {
            //            Data.toast(results);
            if (results.status == "success") {
                $scope.setPartial(-1);
            }
        });
    };

    $scope.get = function () {
        Data.get('getaddress').then(function (results) {
            if (results.status == "success") {
                $scope.address['fb_house_nr'] = results.fb_house_nr;
                $scope.address['fb_street'] = results.fb_street;
                $scope.address['fb_city'] = results.fb_city;
                $scope.address['fb_postcode'] = results.fb_postcode;
                $scope.address['fb_county'] = results.fb_county;
                $scope.address['fb_country'] = results.fb_country;
                $scope.address['fb_formatted'] = results.fb_formatted;

                $scope.addressForm = "editAddress";
            }
            else {
                $scope.addressForm = "findAddress";
            }
        })
    };
});

app.controller('photoCntrl', function ($scope, $rootScope, $http, Data, keyData, appData, $location, $timeout, $window) {
    $scope.fileUpload = '';

    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });

    $scope.$on('photoCntrl', function (e) {
        $scope.$parent.navigation.loadedStatus = ($scope.get() == null ? 'N' : 'Y');
    });

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.get = function () {
        $scope.photo = { fb_filename: '', base64: '', fb_id: keyData.get('fb_id'), performer_id: keyData.get('performer_id'), photo_type: keyData.get('photo_type'), news_id: keyData.get('news_id') };
        if ($scope.photo.photo_type == 'Profile') {
            $scope.photoLegend = keyData.get('fb_name') + " - Profile Photo";
        }
        if ($scope.photo.photo_type == 'Performer') {
            $scope.photoLegend = keyData.get('performerName') + " - Cover Photo";
        }
        if ($scope.photo.photo_type == 'News') {
            $scope.photoLegend = keyData.get('performerName') + " - News Photo";
        }
    }

    $scope.$watch('fileUpload', function () {
        if ($scope.fileUpload != '') {
            $scope.getBase64Image($scope.fileUpload);
            $timeout(function () { $scope.getPhoto(); }, 2000);
        }
    });

    $scope.getPhoto = function () {
        $rootScope.loading = false;
        if (keyData.get('base64')) $scope.photo.base64 = keyData.get('base64');
        keyData.remove('base64');
        $scope.canvas = document.getElementById("mycanvas");
        $scope.rotateVal = 0;

        var canvas = $scope.canvas;
        if ($scope.photo.base64) {
            var gesturableImg = new ImgTouchCanvas({
                canvas: document.getElementById("mycanvas"),
                path: $scope.photo.base64
            });
        }
        else $('#photoUpload').click();
    };

    $scope.save = function () {
        $scope.photo.base64 = $scope.canvas.toDataURL("image/jpeg");
        keyData.set('base64', $scope.photo.base64);
        Data.post('savePhoto', {
            fb_photo: $scope.photo
        }).then(function (results) {
            if (results.status == "success") {
                if ($scope.photo.photo_type == 'News') keyData.set("fb_news_photo", results.fb_photo);
                if ($scope.photo.photo_type == 'Profile') keyData.set("fb_profile_photo", results.fb_photo);
                if ($scope.photo.photo_type == 'Performer') keyData.set('fb_performer_photo', results.fb_photo);
                $scope.back();
            }
        });
    };
});

app.controller('identityCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData) {

    $scope.identity = { fb_alias: '', fb_is_performer: false, fb_title: '', fb_name_first: '', fb_name_middle: '', fb_name_last: '', fb_gender: '', fb_birth_date: null };
    $scope.titles = ['Mr', 'Mrs', 'Miss', 'Miss', 'Dr', 'Sir', 'Rev'];
    $scope.genders = ['Male', 'Female', 'Other'];

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.save = function () {
        Data.post('saveIdentity', {
            fb_identity: $scope.identity
        }).then(function (results) {
            //            Data.toast(results);
            if (results.status == "success") {
                keyData.set("fb_name", results.fb_name);
                $location.path("/profile");
            }
        });
    };

    $scope.get = function () {
        if (keyData.check("idMode") == 'identity') {
            $scope.$watch('identityForm.$valid', function (validity) {
                if (validity) $scope.setFooterButton({ back: 'N', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
                else $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
            });
        } else {
            $scope.$watch('identityForm.$valid', function (validity) {
                if (validity) $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
                else $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
            });
        }

        Data.get('getIdentity').then(function (results) {
            $scope.identity['fb_alias'] = results.fb_alias;
            $scope.identity['fb_title'] = results.fb_title;
            $scope.identity['fb_name_first'] = results.fb_name_first;
            $scope.identity['fb_name_middle'] = results.fb_name_middle;
            $scope.identity['fb_name_last'] = results.fb_name_last;
            $scope.identity['fb_gender'] = results.fb_gender;
            if (results.fb_birth_date) {
                var s = results.fb_birth_date;
                var parts = s.split("-");
                $scope.identity['fb_birth_date'] = new Date(parts[0], parts[1] - 1, parts[2]);
            }
        })
    };

});

app.controller('contactCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {

    $scope.contact = { fb_selected: false, fb_contact_type: '', fb_contact_detail: '' };
    $scope.contactList = {};
    $scope.contact_types = ['Email (other)', 'Home phone', 'Mobile phone', 'Business phone'];
    $scope.addrow = false;
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });

    $scope.get = function () {
        Data.get('getContactList').then(function (results) {
            $scope.contactList = results.fb_contactList;
            $scope.addrow = false;
        })
    };

    $scope.save = function () {
        Data.post('saveContactList', {
            contactList: $scope.contactList
        }).then(function (results) {
            if (results.status == "success") {
                $scope.get();  // reload ng-repeat
            }
        });
    };

    $scope.remove = function () {
        for (i = $scope.contactList.length - 1; i >= 0; i--) {
            if ($scope.contactList[i]["fb_selected"]) {
                $scope.contactList.splice(i, 1);
                $scope.save();
            }
        }
    }

    $scope.init = function () {
        $scope.contact.fb_contact_type = '';
        $scope.contact.fb_contact_detail = '';
        $scope.addrow = true;
    }

    $scope.add = function () {
        $scope.contactList.push(angular.copy($scope.contact));
        $scope.save();
    }

    $scope.anySelected = function (list) {
        for (i = 0; i < list.length; i++) {
            if (list[i]["fb_selected"]) return true;
        }
        return false;
    }
});

app.controller('securityCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {

    $scope.security = { fb_email: '', fb_validation_code: '', fb_pwd: '', fb_pwd2: '', fb_question: '', fb_response: '', orig_pwd: '', fb_photo: 'photos/avt_fanbase.jpg' };
    $scope.original_pwd = '';
    $scope.original_email = '';
    $scope.security_questions = ["Pets name", "Birth place", "First school"];
    $scope.verify_step = 'initiate';

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.$watch('securityForm.$valid', function (validity) {
        if (validity) $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
        else $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    });

    $scope.passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    $scope.$on('securityCntrl', function (e) {
        $scope.$parent.navigation.loadedStatus = ($scope.get() == null ? 'N' : 'Y');
    });

    $scope.get = function () {
        $scope.email_status = 'unverified';
        Data.get('getSecurity').then(function (results) {
            //            Data.toast(results);
            if (results.status == "success") {
                $scope.security = results.fb_security;
                $scope.email_status = 'verified';
                $scope.security.fb_pwd2 = $scope.security.fb_pwd;
                $scope.original_pwd = $scope.security.fb_pwd;
                $scope.original_email = $scope.security.fb_email;
            }
        })
    };

    $scope.verify = function (fb_security) {
        $scope.email_status = 'unverified';
        $rootScope.loading = true;
        Data.post('verifyEmail', {
            fb_security: fb_security
        }).then(function (results) {
            Data.toast(results);
            $rootScope.loading = false;
            if (results.status == "success") {
                $scope.verify_step = 'validate';
            }
        })
    };

    $scope.validate = function (fb_security) {
        $rootScope.loading = true;
        Data.post('validateEmail', {
            fb_security: fb_security
        }).then(function (results) {
            Data.toast(results);
            $rootScope.loading = false;
            if (results.status == "success") {
                $scope.email_status = 'verified';
                $scope.original_email = $scope.security.fb_email;
                $scope.verify_step = 'initiate';
            }
        })
    };

    $scope.save = function () {
        Data.post('saveSecurity', {
            fb_security: $scope.security
        }).then(function (results) {
            if (results.status == "success") {
                Data.toast(results);
                keyData.post("fb_id", results.fb_id);
                keyData.set("fb_email", $scope.security.fb_email);
                if (results.fb_name != '') keyData.set("fb_name", results.fb_name);
                $scope.setPartial(-1);
            }
        });
    };
});

app.controller('performerCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $sce, $timeout, $window, angularPlayer) {

    $scope.fb_search = { type: '', searchstr: '' };
    $scope.news = {
        fb_date: Date(),
        fb_headline: '',
        fb_type: '',
        fb_link: '',
        fb_descr: '',
        news_id: keyData.get("news_id"),
        fb_photo: keyData.get('fb_performer_photo'),
        fb_updater_id: keyData.get('fb_id'),
        performer_id: keyData.get('performer_id'),
        photo_type: keyData.get('photo_type')
    }
    $scope.performer = { fb_id: '', fb_name: '', fb_type: '', fb_status: '', fb_photo: '', fb_joinDt: '', fb_strapline: '', fb_trackCount: 0, fb_linkCount: 0, fb_descr: '' };
    $scope.fb_performer = { performer_id: '' };
    $scope.types = ['Solo Performer', 'Band/Group', 'Choir', 'Troupe', 'Orchestra', 'DJ', 'Karaoke'];
    $scope.stati = ['Active', 'Inactive'];
    $scope.event_types = ['New radio track', 'New video stream', 'Live performance'];

    if (!$rootScope.fb_transition) $rootScope.fb_transition = 'slide-left';

    $scope.initPerformer = function () {
        $scope.setBannerTitle("Performer Profile");
        keyData.set("photo_type", 'Performer');
        $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
        $scope.setCompletion();
        $scope.setBackPage('partials/performer.html');
    }

    $scope.initSummary = function () {
        $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
        $scope.summaryHeight = window.innerHeight - 100;
        $rootScope.currentProcess = "";
        if (window.location.href.indexOf("/home") >= 0) {
            $scope.setBackPage('partials/newsfeed.html');
        }
        if (window.location.href.indexOf("/radio") >= 0) {
            $scope.setBackPage('partials/radioplayer.html');
        }
        if (window.location.href.indexOf("/search") >= 0) {
            $scope.setBackPage('partials/searchPerformers.html');
        }
        $scope.getPerformer();
    }

    $scope.setupSearch = function () {
        $scope.setBannerTitle("Fanbase Search");

        $scope.srch = 'Name';
        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'N' });

        Data.get('getPerformers').then(function (results) {
            $scope.performers = results.performers;
            Data.get('getTowns').then(function (results) {
                $scope.townList = results.towns;
                Data.get('getCounties').then(function (results) {
                    $scope.countyList = results.counties;
                    $scope.find();
                });
            });
        });
    }

    $scope.btnWidth = function () { var x = $('#btngrp').width(); return Math.floor(x / 3); }

    $scope.setSearchType = function (type) {
        $scope.fb_search.type = type;
        $scope.fb_search.searchstr = '';
    }

    $scope.addrow = false;

    $scope.init = function () {
        $scope.performer.fb_photo = 'photos/prf_fanbase.jpg';
        $scope.addrow = true;
    };

    $scope.add = function () {
        Data.post('savePerformer', {
            fb_performer: $scope.performer
        }).then(function (results) {
            //            Data.toast(results);
            $scope.get();  // reload ng-repeat
            $scope.addrow = false;
        });
    };

    $scope.load = function (index) {
        keyData.post('performer_id', $scope.performerList[index].fb_performer_id);
        keyData.set('performerName', $scope.performerList[index].fb_name);
        keyData.set('fb_performer_photo', $scope.performerList[index].fb_photo);
        $scope.getBase64Image($scope.performerList[index].fb_photo);
        $scope.setBackPage('partials/searchPerformers.html');
        $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
        $scope.setCurrentForm("partials/performerMenu.html");
    }

    $scope.show = function (index) {
        keyData.post('performer_id', $scope.performerList[index].fb_performer_id);
        keyData.set('performerName', $scope.performerList[index].fb_name);
        keyData.set('fb_performer_photo', $scope.performerList[index].fb_photo);

        $scope.setCurrentForm("partials/performerSummary.html");
    }

    $scope.get = function () {
        keyData.remove('performer_id');
        $scope.setBannerTitle("Performer Profiles");
        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
        Data.get('getperformerList').then(function (results) {
            if (results.status == "success") {
                $scope.performerList = results.fb_performerList;
            }
        });
    };

    $scope.getPerformer = function () {
        Data.get('getPerformerDetail').then(function (results) {
            if (results.status == "success") {
                $scope.performer['fb_name'] = results.fb_name;
                $scope.performer['fb_type'] = results.fb_type;
                $scope.performer['fb_photo'] = results.fb_photo;
                $scope.performer['fb_status'] = results.fb_status;
                $scope.performer['fb_strapline'] = results.fb_strapline;
                $scope.performer['fb_descr'] = results.fb_descr;
                keyData.set('performerName', results.fb_name);
                keyData.set('fb_performer_photo', results.fb_photo);
            }
            $rootScope.$emit('fillList', keyData.get('performer_id'));
        });
    };

    $scope.find = function () {
        keyData.remove('performer_id');
        Data.getWhere('searchPerformers', {
            fb_search: $scope.fb_search
        }).then(function (results) {
            $scope.performerList = results.performerList;
        })
    };

    $scope.bookingInquiry = function () {
        $scope.setBackPage('partials/performerSummary.html');
        $scope.setCurrentForm('partials/perfBooking.html');
    }

    $scope.setPerfPartial = function (index) {
        $scope.setBackPage('partials/performerMenu.html');
        $scope.setCurrentForm($scope.navigation[index].templateUrl);
    }

    $scope.addNewsItem = function () {
        keyData.remove('photo_type');
        $scope.setBackPage('partials/performerSummary.html');
        $scope.setCurrentForm('partials/newsItem.html');
    }
});

app.controller('weblinkCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, toaster, $window) {

    $scope.weblink = { fb_selected: false, fb_type: '', fb_link: '', fb_descr: '', fb_photo: '' };
    $scope.weblinkList = {};
    $scope.weblink_types = ['Audio Stream', 'Hosted Image', 'Video Stream', 'Own Web Page', 'Merchandise', 'Commercial Download', 'Other'];
    $scope.addrow = false;
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    $scope.fb_performer = { performer_id: '' };
    $rootScope.fileName = '';

    var listener = $rootScope.$on("fillList", function (event, data) { $scope.get(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $rootScope.$watch('fileName', function () {
        if ($rootScope.fileName != '') {
            $scope.weblink.fb_photo = $rootScope.fileName;
            $rootScope.fileName = '';
        }
    })

    $scope.get = function () {
        $scope.getThumbNail = false;
        Data.get('getWeblinkList').then(function (results) {
            $scope.weblinkList = results.fb_weblinkList;
        })
    };

    $scope.save = function () {
        Data.post('saveWeblinkList', {
            weblinkList: $scope.weblinkList
        }).then(function (results) {
            //            Data.toast(results);
            if (results.status == "success") {
                $scope.get();
            }
        });
    };

    $scope.remove = function () {
        for (i = $scope.weblinkList.length - 1; i >= 0; i--) {
            if ($scope.weblinkList[i]["fb_selected"]) {
                $scope.weblinkList.splice(i, 1);
                $scope.save();
            }
        }
    }

    $scope.init = function () {
        $scope.weblink.fb_type = '';
        $scope.weblink.fb_link = '';
        $scope.weblink.fb_descr = '';
        $scope.weblink.fb_photo = keyData.get('fb_performer_photo');
        $scope.addrow = true;
    }

    $scope.add = function () {
        if (ValidURL($scope.weblink.fb_link)) {
            $scope.weblinkList.push(angular.copy($scope.weblink));
            $scope.addrow = false;
            $scope.save();
        }
        else {
            $scope.weblink.fb_link = '';
        }
    }

    $scope.anySelected = function (list) {
        for (i = 0; i < list.length; i++) {
            if (list[i]["fb_selected"]) return true;
        }
        return false;
    }

    $scope.openLink = function (url) {
        $window.open(url);
    }

    $scope.thumbNail = function () {
        $scope.getThumbNail = true;
    }

    function ValidURL(str) {
        var fail = { status: 'error', message: 'Invalid URL, please re-enter' }
        var s = str.toLowerCase();

        var pattern = new RegExp("^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$", 'i');
        if (!pattern.test(s)) {
            toaster.pop(fail.status, "", fail.message, 5000, 'trustedHtml');
            return false;
        } else {
            if (s.substring(0, 8) != 'https://') {
                toaster.pop('error', "", 'Not a secure URL, must start with https:', 5000, 'trustedHtml');
                return false;
            }
            else {
                return true;
            }
        }
    }
});

app.controller('trackCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, toaster) {

    $scope.track = { fb_id: '', fb_selected: false, fb_track_type: '', fb_url_type: '', fb_title: '', fb_track_url: '', fb_track_base64: '', fb_photo: '', fb_name: '', isPlaying: false };
    $scope.trackList = {};
    $scope.track_types = ['Original', 'Cover', 'Other'];
    $scope.url_types = ['Upload', 'External'];
    $scope.addrow = false;
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    $scope.modalplayer = true;
    $rootScope.trackPlayed = false;
    $scope.fb_performer = { performer_id: '' };

    var listener = $rootScope.$on("fillList", function (event, data) { $scope.get(); });

    $scope.$on('$destroy', function () {
        listener();
        soundManager.stopAll();
    });

    $scope.trackSummary = function (id) {
        keyData.post('performer_id', id);
        $scope.get();
    }

    $scope.$watch('fileUpload', function () {
        if ($scope.fileUpload) {
            $scope.track.fb_track_base64 = $scope.fileUpload;
            $rootScope.loading = false;
            if ($scope.track.fb_track_base64 != '') {
                $scope.track.fb_track_url = 'Uploaded succesfully';
            }
            else {
                $scope.track.fb_track_url = '';
            }
        }
    });

    $scope.isRadio = function () { return window.location.href.indexOf("/radio") > 0; }

    $scope.get = function () {
        Data.get('getTrackList').then(function (results) {
            $scope.trackList = results.fb_trackList;
        })
    };

    $scope.save = function () {
        Data.post('saveTrack', {
            fb_track: $scope.track
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $scope.get();
            }
        });
    };

    $scope.remove = function () {
        for (i = $scope.trackList.length - 1; i >= 0; i--) {
            if ($scope.trackList[i]["fb_selected"]) {
                Data.post('removeTrack', {
                    fb_track: $scope.trackList[i]
                }).then(function (results) {
                    if (results.status == "success") {
                        if (isLast($scope.trackList, i)) $scope.get();
                    }
                });
            }
        }
    };

    function isLast(list, index) {
        for (i = index - 1; i >= 0; i--) { if (list[i]["fb_selected"]) return false; }
        return true;
    }

    $scope.init = function () {
        $scope.track.fb_track_type = '';
        $scope.track.fb_url_type = '';
        $scope.track.fb_title = '';
        $scope.track.fb_descr = '';
        $scope.track.fb_track_url = '';
        $scope.track.fb_track_base64 = '';
        $scope.addrow = true;
    }

    $scope.add = function () {
        $scope.save();
        $scope.addrow = false;
    }

    $scope.anySelected = function (list) {
        if (list) {
            for (i = 0; i < list.length; i++) {
                if (list[i]["fb_selected"]) return true;
            }
        }
        return false;
    }

    $scope.play = function (index) {
        $scope.trackIndex = index;
        $rootScope.Ui.turnOn('modalplay');
    };

    $scope.buttonPlay = function (index) {

        for (i = $scope.trackList.length - 1; i >= 0; i--) {
            $scope.trackList[i].isPlaying = false;
        }

        var url = $scope.trackList[index].fb_track_url;
        var track = soundManager.createSound({ url: url });
        track.play();
        $scope.trackList[index].isPlaying = true;
        $rootScope.trackPlayed = true;
    };

    $scope.buttonStop = function (index) {
        soundManager.stopAll();
        $scope.trackList[index].isPlaying = false;
    };
});

app.controller('perfdetailsCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData) {

    $scope.perfdetail = { fb_name: '', fb_type: '', fb_status: '', fb_strapline: '', fb_descr: '', fb_photo: '' };
    $scope.types = ['Solo Performer', 'Band / Group', 'Choir', 'Troupe', 'Cooperative'];
    $scope.stati = ['Active', 'Inactive'];
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.save = function () {
        Data.post('savePerformerDetail', {
            fb_performerdetail: $scope.perfdetail
        }).then(function (results) {
            if (results.status == "success") {
                $scope.back();
            }
        });
    };

    $scope.get = function () {
        Data.get('getPerformerDetail').then(function (results) {
            $scope.perfdetail['fb_name'] = results.fb_name;
            $scope.perfdetail['fb_type'] = results.fb_type;
            $scope.perfdetail['fb_status'] = results.fb_status;
            $scope.perfdetail['fb_strapline'] = results.fb_strapline;
            $scope.perfdetail['fb_descr'] = results.fb_descr;
        })
    };
});

app.controller('membersCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData) {

    $scope.member = { fb_selected: false, fb_photo: '', fb_name: '', fb_owner: '', fb_member_id: '' };
    $scope.memberList = {};
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    $scope.fb_search = { searchstr: '' };
    $scope.fb_refresh = 'N';

    var listener = $rootScope.$on("fillList", function (event, data) { $scope.get(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.$watch('fb_refresh',
        function () {
            if ($scope.fb_refresh == 'Y') {
                $scope.get();
            }
        });

    $scope.get = function () {
        Data.get('getMemberList').then(function (results) {
            $scope.memberList = results.memberList;
            $scope.fb_refresh = 'N';
        })
    };

    $scope.remove = function () {
        for (i = $scope.memberList.length - 1; i >= 0; i--) {
            if ($scope.memberList[i]["fb_selected"]) {
                Data.post('setMemberId', {
                    fb_member: $scope.memberList[i]
                }).then(function (results) {
                    Data.delete('removeMember').then(function (results) {
                        if (isLast($scope.memberList, i)) {
                            $scope.get();
                        }
                    })
                    Data.post('unsetMemberId');
                })
            }
        }
    }

    function isLast(list, index) {
        for (i = index - 1; i >= 0; i--) { if (list[i]["fb_selected"]) return false; }
        return true;
    }


    $scope.anySelected = function () {
        if ($scope.memberList.length > 0) {
            for (i = 0; i < $scope.memberList.length; i++) {
                if ($scope.memberList[i]["fb_selected"]) return true;
            }
        }
        return false;
    };

    $scope.find = function () {
        if ($scope.fb_search != '') {
            Data.post('setSearch', {
                fb_search: $scope.fb_search
            }).then(function (results) {
                Data.get('searchMembers').then(function (results) {
                    Data.post('unsetSearch');
                    $scope.memberList = results.memberList;
                })
            })
        }
    };

    $scope.add = function (index) {
        Data.post('setMemberId', { fb_member: $scope.memberList[index] }).then(function (results) {
            Data.post('addMember', { fb_member: $scope.memberList[index] }).then(function (results) {
                Data.post('unsetMemberId');
                $scope.fb_refresh = 'Y';
            });
        });
    };
});

app.controller('locationCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData) {

    $scope.location = { fb_selected: false, fb_type: '', fb_town: '', fb_county: '' };
    $scope.locationList = {};
    $scope.location_types = ['County', 'Town'];
    $scope.addrow = false;
    $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    $scope.selected = undefined;

    var listener = $rootScope.$on("fillList", function (event, data) { $scope.perfGet(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.perfGet = function () {
        $rootScope.loading = true;
        Data.get('getPerfLocations', { performer_id: keyData.get('performer_id') }).then(function (results) {
            $scope.locationList = results.fb_locationList;
            $scope.addrow = false;
            Data.get('getTowns').then(function (results) {
                $scope.townList = results.towns;
                Data.get('getCounties').then(function (results) {
                    $scope.countyList = results.counties;
                    $rootScope.loading = false;
                });
            });
        });
    };

    $scope.persGet = function () {
        $rootScope.loading = true;
        Data.get('getPersLocations').then(function (results) {
            $scope.locationList = results.fb_locationList;
            $scope.addrow = false;
            Data.get('getTowns').then(function (results) {
                $scope.townList = results.towns;
                Data.get('getCounties').then(function (results) {
                    $scope.countyList = results.counties;
                    $rootScope.loading = false;
                });
            });
        });
    };

    $scope.save = function () {
        if (keyData.check('performer_id')) {
            Data.post('savePerfLocations', {
                locationList: $scope.locationList
            }).then(function (results) {
                //            Data.toast(results);
                if (results.status == "success") {
                    $scope.perfGet();  // reload ng-repeat
                }
            });
        }
        else {
            Data.post('savePersLocations', {
                locationList: $scope.locationList
            }).then(function (results) {
                //            Data.toast(results);
                if (results.status == "success") {
                    $scope.persGet();  // reload ng-repeat
                }
            });
        }
    };

    $scope.remove = function () {
        for (i = $scope.locationList.length - 1; i >= 0; i--) {
            if ($scope.locationList[i]["fb_selected"]) {
                $scope.locationList.splice(i, 1);
                $scope.save();
            }
        }
    }

    $scope.init = function () {
        $scope.location.fb_type = '';
        $scope.location.fb_county = '';
        $scope.location.fb_town = '';
        $scope.addrow = true;
    }

    $scope.add = function () {
        $scope.locationList.push(angular.copy($scope.location));
        $scope.save();
    }

    $scope.anySelected = function (list) {
        for (i = 0; i < list.length; i++) {
            if (list[i]["fb_selected"]) return true;
        }
        return false;
    }
});

app.controller('playerCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, $timeout, $sce, angularPlayer) {

    $scope.currentTrack = 0;
    $scope.showplayList = false;
    $scope.playerSize = 0;
    $scope.currentTrack = '';
    $scope.summaryHeight = $(document).height() - 180;
    $scope.trackList = {};

    $scope.getRadio = function () {
        $scope.setFooterButton({ back: 'N', home: 'Y', save: 'N', radio: 'N', search: 'Y' });
        $rootScope.loading = true;
        Data.get('getRadioFeed').then(function (results) {
            $scope.trackList = results.fb_trackList;
            $scope.setBannerTitle("Fanbase Radio");
            $scope.init();
            $rootScope.loading = false;
        })
    };

    $scope.$on('$destroy', function () {
        soundManager.stopAll();
    });

    $scope.gotPerformer = function () { return keyData.check('performer_id') };

    $scope.audioButtonClick = function (value) {
        switch (value) {
            case 'pause':
                $scope.nowPlaying = false;
                if ($scope.audioTrack) $scope.audioTrack.pause();
                soundManager.togglePause();
                break;

            case 'play':
                $scope.nowPlaying = true;
                if ($scope.audioTrack) $scope.audioTrack.play();
                break;

            case 'stop':
                $scope.nowPlaying = false;
                if ($scope.audioTrack) $scope.audioTrack.stop();
                $scope.progress = 0;
                break;

            case 'previous':
                $scope.playAudio(--$scope.currentTrack);
                break;

            case 'next':
                $scope.playAudio(++$scope.currentTrack);
                break;
        }
    };

    $('.btn').mouseup(function () { this.blur() });
    $('.fb_audiolink').mouseup(function () { this.blur() });

    $scope.init = function () {

        $scope.playlist = [];
        $scope.playlistId = 0;
        for (i = 0; i < $scope.trackList.length; i++) {
            if (i == $scope.trackIndex || $scope.trackIndex < 0) {
                $scope.playlist.push(
                    {
                        id: 'Track' + ("00" + i).slice(-3),
                        title: $scope.trackList[i].fb_title,
                        artist: $scope.trackList[i].fb_name,
                        url: $scope.trackList[i].fb_track_url,
                        artist_id: $scope.trackList[i].fb_performer_id,
                        photo: $scope.trackList[i].fb_photo
                    });
            }
        }

        // Start
        $scope.playAudio(0);
    }

    $scope.playAudio = function (playlistId) {
        $scope.summaryLoad = false;
        playlistId = playlistId ? playlistId : 0;
        if ($scope.audioTrack) {
            $scope.audioTrack.destruct();
            if (playlistId >= $scope.playlist.length || playlistId < 0) {
                playlistId = 0;
            }
        }

        $timeout(function () { $scope.trackDetail = $scope.trackList[playlistId]; $scope.summaryLoad = true; }, 500);

        $scope.audioCaption = $scope.trackList[playlistId].fb_title + " by " + $scope.trackList[playlistId].fb_name;
        keyData.post('performer_id', $scope.playlist[playlistId].artist_id);
        $scope.currentTrack = playlistId;

        soundManager.onready(function () {
            $scope.audioTrack = soundManager.createSound({
                id: $scope.playlist[playlistId].id,
                url: $scope.playlist[playlistId].url,
                autoLoad: true,
                autoPlay: true,
                volume: 50,
                onfinish: function () {
                    playlistId++;
                    while (!soundManager.canPlayURL($scope.playlist[playlistId].url)) {
                        if (playlistId++ >= $scope.playlist.length) playlistId = 0;
                    }
                    $scope.playAudio(playlistId);
                }
            })
        });
    }

    $scope.closePlayList = function () {
        $scope.showplayList = false;
    }

    $scope.fullSummary = function () {
        keyData.post('performer_id', $scope.trackDetail.fb_performer_id);
        keyData.set('performerName', $scope.trackDetail.fb_name);
        keyData.set('fb_performer_photo', $scope.trackDetail.fb_photo);

        $scope.setBackPage('partials/radioplayer.html');
        $scope.setCurrentForm('partials/performerSummary.html');
    }
});

app.controller('newsCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, toaster) {

    $scope.newsItemList = {};
    $scope.news = {};
    $scope.event_types = ['New video link', 'New audio link', 'Live performance'];
    $scope.isPlaying = false;
    $scope.fileUpload = '';

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.$watch('editNewsForm.$valid', function (validity) {
        if (validity) $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
        else $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    });

    $scope.init = function () {
        $scope.setBannerTitle("Fanbase News Item");
        $scope.setBackPage('partials/performerSummary.html');
    }

    $scope.save = function () {
        var doPost = true;
        if ($scope.news.fb_link != '') {
            doPost = validURL($scope.news.fb_link);
        }
        if (doPost) {
            $scope.news['fb_updater_id'] = keyData.get('fb_id');
            Data.post('saveNewsItem', {
                fb_news: $scope.news
            }).then(function (results) {
                Data.toast(results);

                delete $scope.news;
                $scope.back();
            });
        }
        else {
            Data.toast({ status: 'error', message: 'Invalid url specified' });
        }
    }

    $scope.getNewsItem = function () {
        $scope.setBackPage('partials/performerSummary.html');
        if (keyData.get('fb_id') <= 0) {
            Data.toast({ status: 'error', message: 'Not logged in - please sign into Fanbase to add or amend news items' });
            $scope.back();
        }
        else {
            keyData.set('photo_type', 'News');
            if (keyData.get("news_id") > 0) {
                Data.getWhere('getNewsItem', { fb_news_id: keyData.get("news_id") }).then(function (results) {
                    $scope.news['news_id'] = keyData.get("news_id");
                    $scope.news['fb_id'] = results.news.fb_id;
                    $scope.news['fb_type'] = results.news.fb_type;
                    $scope.news['fb_headline'] = results.news.fb_headline;
                    $scope.news['fb_link'] = results.news.fb_link;
                    $scope.news['fb_descr'] = results.news.fb_descr;
                    $scope.news['fb_photo'] = results.news.fb_photo;
                    var d = results.news.fb_date;
                    var parts = d.split("-");
                    $scope.news['fb_date'] = new Date(parts[0], parts[1] - 1, parts[2]);
                });
            } else {
                $scope.news = {
                    fb_date: null,
                    fb_headline: '',
                    fb_type: '',
                    fb_link: '',
                    fb_descr: '',
                    news_id: 0,
                    fb_id: 0,
                    fb_photo: keyData.get('fb_performer_photo'),
                    fb_updater_id: keyData.get('fb_id'),
                    performer_id: keyData.get('performer_id'),
                    photo_type: keyData.get('photo_type')
                }
            }
            // have we already been through here?
            if (appData.get('news')) {
                var nws = appData.get('news');
                $scope.news['fb_headline'] = nws.fb_headline;
                $scope.news['fb_link'] = nws.fb_link;
                $scope.news['fb_descr'] = nws.fb_descr;
                $scope.news['fb_date'] = nws.fb_date;
                $scope.news['fb_photo'] = nws.fb_photo;
                appData.remove('news');
            }
            // have we loaded a photo already?
            if (keyData.check("fb_news_photo")) {
                $scope.news['fb_photo'] = keyData.get("fb_news_photo");
                keyData.remove("fb_photo");
            }
        }
    }

    $scope.getNewsItemList = function () {
        Data.getWhere('listNewsItems', {
            fb_performer_id: keyData.get("performer_id")
        }).then(function (results) {
            $scope.newsItemList = results.newsList;
        });
    }

    $scope.editNewsPhoto = function () {
        appData.set('news', $scope.news);
        if ($scope.news["fb_photo"] != '') {
            $scope.getBase64Image($scope.news["fb_photo"]);
        }
        $scope.setBackPage('partials/newsItem.html');
        $scope.setCurrentForm('partials/photo.html');
    }
    $scope.trackPlay = function () {
        soundManager.stopAll();
        var url = $scope.news.fb_track_base64;
        var track = soundManager.createSound({ url: url });
        track.play();
        $scope.isPlaying = true;
    };

    $scope.trackStop = function (index) {
        soundManager.stopAll();
        $scope.isPlaying = false;
    };

    $scope.editNewsItem = function (index) {
        keyData.set("news_id", $scope.newsItemList[index].fb_id);
        $scope.setBackPage('partials/performerSummary.html');
        $scope.setCurrentForm('partials/newsItem.html');
    }
});

app.controller('bookingCntrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, keyData, appData, toaster) {

    $scope.booking_types = ['Private function', 'Festival', 'Pub / bar event', 'Open mic',];

    var listener = $rootScope.$on("save", function (event, data) { $scope.save(); });
    $scope.$on('$destroy', function () { listener(); });  // stop multiple calls on digest loop

    $scope.$watch('editBooking.$valid', function (validity) {
        if (validity) $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'Y', radio: 'Y', search: 'Y' });
        else $scope.setFooterButton({ back: 'Y', home: 'Y', save: 'N', radio: 'Y', search: 'Y' });
    });

    $scope.init = function () {
        $scope.setBannerTitle("Booking Inquiry");
        $scope.setBackPage('partials/performerSummary.html');
        $scope.booking = { fb_date: null, fb_type: '', fb_descr: '', fb_contact_name: '', fb_contact_detail: '', fb_descr: '', fb_link: '', performer_id: keyData.get("performer_id") };
        Data.get('initBooking').then(function (results) {
            if (results.status == "success") {
                $scope.booking["fb_contact_name"] = results["fb_contact_name"];
                $scope.booking["fb_contact_detail"] = results["fb_contact_detail"];
                $scope.booking["fb_date"] = new Date();
            } else {
                Data.toast(results);
                $scope.back();
            }
        });
    }

    $scope.save = function () {
        var doPost = true;
        if ($scope.booking.fb_link != '') {
            doPost = validURL($scope.news.fb_link);
        }
        if (doPost) {
            Data.post('saveBooking', { fb_booking: $scope.booking }).then(function (results) {
                Data.toast(results);
                delete $scope.booking;
                $scope.back();
            });
        } else {
            Data.toast({ status: 'error', message: 'Invalid url specified' });
        }
    }
});