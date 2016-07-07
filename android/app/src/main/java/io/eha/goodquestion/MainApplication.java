package io.eha.goodquestion;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.AirMaps.AirPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);
  private ReactNativePushNotificationPackage mReactNativePushNotificationPackage;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
        new RealmReactPackage(),
        mReactNativePushNotificationPackage
      );
    }
  };

  // Add onNewIntent
  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    mReactNativePushNotificationPackage.newIntent(intent);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
}