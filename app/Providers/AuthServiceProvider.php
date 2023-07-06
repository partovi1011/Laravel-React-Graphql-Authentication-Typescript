<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            
        //     return (new MailMessage)
        //         ->subject('Verify Email Address')
        //         ->line('Click the button below to verify your email address.')
        //         ->action('Verify Email Address', $url);
        // });
        VerifyEmail::createUrlUsing(function ($notifiable) {
            $token = sha1($notifiable->getKey() . $notifiable->getEmailForVerification());
            $notifiable->email_verify_token = $token;
            $notifiable->email_verify_expire = Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60));
            $notifiable->save();
            // $frontendUrl = 'http://cool-app.com/auth/email/verify';
    
            // $verifyUrl = URL::temporarySignedRoute(
            //     'verification.verify',
            //     Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            //     [
            //         'id' => $notifiable->getKey(),
            //         'hash' => sha1($notifiable->getEmailForVerification()),
            //     ]
            // );
    
            return Config::get('app.url') . '?token=' . $token . '&email=' . $notifiable->getEmailForVerification();
        });
    }
}
