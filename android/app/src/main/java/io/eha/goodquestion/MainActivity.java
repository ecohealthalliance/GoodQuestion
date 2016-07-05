package io.eha.goodquestion;

import android.content.Intent;
import android.os.Bundle;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.AirMaps.AirPackage;
import com.zmxv.RNSound.RNSoundPackage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

import io.realm.react.RealmReactPackage;

public class MainActivity extends ReactActivity {
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);
    private ReactNativePushNotificationPackage mReactNativePushNotificationPackage;

    public MainActivity() {
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GoodQuestion";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return io.eha.goodquestion.BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(this);
        return Arrays.<ReactPackage>asList(
                new RNBackgroundGeolocation(this),      // <-- for background-geolocation
                new MainReactPackage(),
                new VectorIconsPackage(),
                new AirPackage(),
                new RNSoundPackage(),
                new RealmReactPackage(),
                mReactNativePushNotificationPackage
        );
    }

    // Add onNewIntent
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        mReactNativePushNotificationPackage.newIntent(intent);
    }
}
