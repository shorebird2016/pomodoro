//this supports pomodoro timer operation - app always runs in 3 states - timing session, timing break, paused
angular.module('myPomodoroApp', [])
    .controller('myPomodoroCtrl', ['$interval', function ($interval) {
        var vm = this;

        vm.sessionTime = 25;//in minutes
        vm.breakTime = 5;
        vm.inSession = true;//boolean flag true = in session, false = in break
        vm.paused = true;
        vm.remainingTime = vm.sessionTime * 60;//in seconds
        vm.countDown = "00:00";
        vm.startStopFace = "start-timer";

        vm.incSession = function () {
            if (vm.sessionTime > 100) return;
            vm.sessionTime++;
            if (vm.inSession) vm.remainingTime = vm.sessionTime * 60;
        };
        vm.decSession = function () {
            if (vm.sessionTime === 1) return;
            vm.sessionTime--;
            if (vm.inSession) vm.remainingTime = vm.sessionTime * 60;
        };
        vm.incBreak = function () {
            if (vm.breakTime > 10) return;
            vm.breakTime++;
            if (!vm.inSession) vm.remainingTime = vm.breakTime * 60;
        };
        vm.decBreak = function () {
            if (vm.breakTime === 1) return;
            vm.breakTime--;
            if (!vm.inSession) vm.remainingTime = vm.breakTime * 60;
        };
        vm.pauseResume = function () {
            if (vm.paused) {//resume
vm.startStopFace = "stop-timer";
                vm.paused = false;
                vm.intvPromise = $interval(function () {
                    vm.remainingTime--;
                    //convert total time to 4 digit string, update clock
                    vm.countDown = numberToString(vm.remainingTime / 60) + ':' + numberToString(vm.remainingTime % 60) ;
                    if (vm.remainingTime == 0) {//count to 0, continue on the other one
                        if (vm.inSession) {//was in session
                            vm.remainingTime = vm.breakTime * 60;
                            vm.inSession = false;
                            //play a sound
                            var audio1 = new Audio('beep1.wav');
                            audio1.play();
                        }
                        else {//was in break
                            vm.remainingTime = vm.sessionTime * 60;
                            vm.inSession = true;
                            var audio2 = new Audio('beep2.wav');
                            audio2.play();
                        }
                        vm.countDown = numberToString(vm.remainingTime / 60) + ':00';
                    }
                }, 1000);
            }
            else {//currently running, stop timer
                vm.paused = true;
                $interval.cancel(vm.intvPromise);
vm.startStopFace = "start-timer";
            }
        };

        //convert number to clock string
        function numberToString(number) {
            var min = Math.floor(number / 10);
            return min + '' + Math.floor(number % 10);
        }
    }]);

