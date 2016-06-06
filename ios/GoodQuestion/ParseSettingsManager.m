#import "ParseSettingsManager.h"
@implementation ParseSettingsManager

RCT_EXPORT_MODULE();

// RCT_EXPORT_METHOD(setParse:(NSString *)location)
RCT_EXPORT_METHOD(setParse)
{
  NSLog(@"Called setParse for: %@", location);
  // RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

@end
